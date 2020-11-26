---
title: 'Turning a <canvas> into a perfect quality gif'
date: 2020-11-27
description:
  Recently I had to turn a canvas animation into a gif to post on social media.
  This article explains how I did it!
image: canvas-to-gif/still.png
---

Recently I made an animation using canvas that I wanted to turn into a gif. The
animation looks like this:

<iframe src="https://sketchbook.macr.ae/perspective-lines" style="width: 100%; height: 427.5px; border: none"></iframe>

## Screen recording

I wanted to turn it into a gif to post it on Twitter, so I opened my screen
recording software: this was the output:

<video autoplay muted loop playsinline style="width: 100%">
  <source src="/article-images/canvas-to-gif/screen-recorder.mov" type="video/mp4" />
</video>

Ouch 😬

As you might be able to spot, the framerate has dropped considerably. It's also
not a perfect loop, which probably isn't too tricky to fix, but still annoying.

<small>(the bars are also probably a different width: that's not a problem, it's
just because the video was recorded on a wider screen than the preview of the
animation above)</small>

I tried a few different screen recording apps, and they all had the same
problem. It's not necessarily the fault of the screen recorder - it's just that
recording the screen causes the framerate of the animation itself to drop.

## MediaRecorder API

Next, after some Googling, I found
[this answer](https://stackoverflow.com/a/50683349/902207) on Stack Overflow
which suggested using the MediaRecorder API.

Here's the output:

<video autoplay muted loop playsinline style="width: 100%">
  <source src="/article-images/canvas-to-gif/media-recorder.mp4" type="video/mp4" />
</video>

It's even worse! Clearly, this won't do.

## Manual creation

The final option I tried felt a bit like the nuclear option at the time,
although it turned out to be a lot easier than I thought it would be. It's based
on the gif exporting functionality from Matt DesLauriers's
[canvas-sketch](https://github.com/mattdesl/canvas-sketch) framework, except it
doesn't require the framework.

It works by simulating the running of the animation by calling the function that
would be called by `requestAnimationFrame`, but passing in the timestamp we want
that frame to be in the final gif. In this case, we want the gif to be 50fps\*,
so the timestamps passed in are `0`, `20`, `40`, etc. Then, for each frame, we
export the canvas as a base64 png and store it on an object.

<small>\*If you're used to web animation, you're probably used to 60fps—however,
gifs can't be 60fps as according to
[this answer on Stack Overflow](https://superuser.com/a/1449370) gif frame delay
times must be specified as a number of hundredeths of a second. 100fps, 50fps,
and 25fps are all possible, but 60fps is not. We'll go with 50fps as it's
closest to 60fps.</small>

The big advantage of this approach is that it isn't reliant on the framerate
in the browser: in theory, the browser could be running at 1fps, and while it
would take a while to generate the images (and would lock up the browser in the
process—only do this locally!), the resulting gif would run at 60fps.

Here's the code to generate an image for each frame:

```js
const options = {
  fps: 50,
  duration: 1000,
  canvas: document.querySelector('#canvas')
};

const framesData = {};

const frameDuration = 1e3 / options.fps;
const frames = Math.round(options.duration / frameDuration);
const framesNameLength = Math.ceil(Math.log10(frames));

for (let i = 0; i < frames; i++) {
  const timestamp = i * frameDuration;

  // This is the function to render to canvas
  frame(timestamp);

  const frameName = i.toString().padStart(framesNameLength, '0');
  framesData[frameName] = options.canvas.toDataURL('image/png');
}
```

A couple things to note:

- The `frame` function should be the function that `requestAnimationFrame`
  would call if the animation were running.
- The frame names are automatically padded with 0s so that they sort correctly
  as strings. For example, if there are 50 frames, "2" will become "02".

That will produce an object something like this:

```json
{
  "00": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAA..."
  "01": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAA..."
  "02": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAA..."
  "03": "...",
  // ...
}
```

If your animation is like mine, the base64 output might look the same at the
beginning and the end for all frames—as you can see in the example above. Don't
worry about it though, it's far better to check the images when they're actual
images after the next step!

### Downloading the images

Next, instead of downloading all the images through the browser (which is
_technically_ possible, it would just be irritating), let's create a little
server-side script that we can send all the images to and it will save them into
a directory.

```js
// Do not let this anywhere near your production servers!
app.post('/save-images', bodyParser.json({ limit: '50mb' }),
  (req, res) => {
    const framesData = Object.entries(req.body.framesData)

    for (const [frameName, frameData] of framesData) {
      const base64Data = frameData
        .replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(
        `frames/${frameName}.png`,
        base64Data,
        'base64'
      );
    }

    console.log(
      `Saved ${Object.keys(framesData).length} files`
    );

    res.send('okay :)');
  });
```

You can see it in context
[here](https://github.com/callumacrae/sketchbook/blob/master/server/index.js).

Hopefully there's nothing too complicated going on here: it's iterating through
all the frames saving them to disk one at a time. One thing to note is that you
might have to adjust the body-parser request size limit if you're saving a
large animation: the error when it goes wrong is pretty clear, though.

As a quick aside, **do not put this code on your production servers**. It
allows anyone to write arbitrary files to anywhere the script has access to,
and so is incredibly dangerous if put anywhere with public access. It should
**only be used locally**.

Now, you can post your frames data from the browser to the server using
something like this:

```js
fetch('http://localhost:3000/save-images', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ framesData, options })
});
```

Now check out the `frames` directory - it should be full of image files, one
per frame. This is a good point to skim through them and make sure they're
being exported correctly.

### Stitching the images together

The final step is to combine all the images together into a gif file. Let's
use [ffmpeg](https://ffmpeg.org/) for this.

The command to run is as follows:

```
$ ffmpeg -f image2 -framerate 50 -i %002d.png out.gif
```

This stitches all the files matching `%002d.png` in the current directory
together and outputs the newly created gif as `out.gif`.

<small>`%002d.png` means a two digit number with a trailing 0 if it is only
one digit long—for example, 09.png. You'll need to adjust it for one or three
digit numbers.</small>

<video autoplay muted loop playsinline style="width: 100%">
  <source src="/article-images/canvas-to-gif/lines.mp4" type="video/mp4" />
</video>

Finally, a perfectly smooth, high resolution gif!

### Bonus round: optimisation

Depending on what you're going to do with the gif, one really important final
step is to optimise the gif—the resulting file for my animation was 4.57MB!

If you're uploading it to somewhere like Twitter, you probably don't need to
do this as it will do it for you.

If you're using it on your own website, it might be easier to do what I did
above and just use a looping video instead. The ffmpeg command to get an mp4
video instead of a gif is as follows:

```
$ ffmpeg -f image2 -framerate 50 -i %002d.png -vcodec mjpeg -vcodec libx264 out.mp4
```

This produces a video which is only 124KB for my animation—before compression!

If you want to check out the actual gif, you can find it
[here](/article-images/canvas-to-gif/lines.gif).

---

I hope you found this article useful 😊 feel free to take any of the code and
use it in your own projects—it's all available under the MIT license.
