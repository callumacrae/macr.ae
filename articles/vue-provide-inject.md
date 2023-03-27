---
title: "A love letter to Vue's provide / inject (and why you should use it)"
date: 2023-03-26
description:
  I love Vue's provide / inject functionality, and I think it's massively
  underutilised by the Vue community. I'm going to tell you why I'm such a huge
  fan of it, and hopefully convince you—and show you how—you can use it yourself
  in your applications.
---

I love Vue's provide / inject functionality, and I think it's massively
underutilised by the Vue community. It can be used to ease a bunch of common
pain points, especially in larger or more complicated applications. I'm going to
tell you why I'm such a huge fan of it, and hopefully convince you—and show you
how—you can use it yourself in your applications.

## What is provide / inject?

At a high level, provide / inject is a way of passing data from a component to
its descendent components (aka child components, children of child components,
and so on). It works as an alternative to props, with the big advantage that it
can pass data to nested components, not just its own children.

Let's say we're building an interface like this, where you can click on a user's
profile picture next to a message they've sent to a see a preview of their
profile:

@todo: add image

You'll notice that the user profile is aware of the current server we're looking
at messages on, but is likely nested deeply below any component that has—or at
least _should_ have—any knowledge of the server.

Let's imagine the component tree looks something like this:

- ChatApp
  - GlobalSidebar
  - ChatServer
    - ServerChannels
    - ChannelMessages
      - ChannelMessage
        - UserProfilePicture
          - UserProfilePopup

(todo: replace with screenshot of vue devtools)

There's several places in `UserProfilePopup` where information from the server
is used, the most obvious of which being the name and server icon below "Member
since". However, let's say for sake of this example that the server information
_isn't_ used by `UserProfilePicture`, `ChannelMessage`, or `ChannelMessages`.
What now?

Provide / inject is one case this is perfect for. In `ChatApp` we can _provide_
the data using the `provide` function:

```html
<script setup>
  import { computed, provide } from 'vue';
  import { useServerInfo } from './composables/server-info';

  const serverId = computed(() => /* get from props */);
  const serverInfo = useServerInfo(serverId);

  provide('server-info', serverInfo);
</script>
```

And now in any child of that component, no matter whether it's an immediate
child or more deeply nested, can retrieve the `serverInfo` data using the
`inject` function, like so:

```html
<script setup>
  import { inject } from 'vue';

  const serverInfo = inject('server-info');
</script>
```

This prevents us from having to pass the `serverInfo` object all the way down
the tree from component to component using props. This is what's known as "prop
drilling", and is a fairly common problem in larger applications.

_If you're thinking "But why not just use global state?", that's a good question
to ask, and another valid approach—we'll look into this later._

I'll be digging further in to how to actually use it later on in the article,
but hopefully this is enough to help you understand the concept. If not, the Vue
documentation has another example with a diagram here:
<https://vuejs.org/guide/components/provide-inject.html>

## Why is it so great?

Provide / inject is super useful both for the problems it solves, and for the
problems it helps avoid.

The immediate and probably most obvious example is the prop drilling example I
already gave, but let's talk in a bit more detail about why prop drilling is
harmful, and what provide / inject helps us with that other solutions do not.

### The principle of least knowledge

The principle of least knowledge, also known as the "Law of Demeter", explains
that a component should only have access to the data and functionality that it
needs to perform its specific task—and therefore shouldn't be aware of the data
and functionality needed by other components behind the minimum necessary to
call that component.

In other words, a component used to render a message shouldn't be aware of the
time the user who sent the message joined the current server, as that's not
relevant to the rendering of the message.

Sticking to this principle as much as possible has a few advantages:

- Components are less complex, as they are required to have knowledge of less
  data—only the data used to render that specific component, not the data
  required by its descendents.
- Reusability is improved, both from a composability point of view and a direct
  component reuse point of view. In order to be used in a new place, we don't
  have to pass in the extra data the component requires but isn't directly
  using.
- Components are easier to test, as the data consumed by its descendents no
  longer has to be mocked when testing that component—or at least, if deeply
  testing the component (aka, testing both the component itself and its
  descendents), the data only has to be mocked in one place, not many.

### "Lifting state up"

Lifting state up refers to the process of moving data storage up the component
tree so that it's only stored in one place. For example, when viewing a
collection of messages between two people, storing the user information
associated with each message on the message itself means that the user data is
duplicated, which can lead both to memory issues, and issues with data going out
of date. Lifting the data out of the message components onto a higher
component—say, the component containing all the messages—and then having only
the user ID associated with the message stored on the message itself for a child
component to look up the data with eliminates this duplication and any
associated issues.

Further to this, if the component responsible for displaying the collection of
messages is adjacent to a list of users, we can lift the user data up another
level

Imagine we didn't lift this state up, and then wanted to add an online status
icon onto user's profile pictures, both next to messages and in the list of
users. With the data duplicated on every message and in the user list component,
this would involve a lot of duplicate work, and would also mean that those
components have to be aware of the online status of those users, also violating
the principle of least knowledge.

But then where do we keep that user data? Provide / inject is one of a number of
solutions that can help us here.

### Don't lift state too high

A corollary or consequence of these two principles that I like to apply is that
data should be stored at the lowest possible level where it still can be
accessed everywhere it is needed.

When I say this, I mean that we should lift state up until the data is only
stored once, and then _lift no further_. Lifting data too high means that
components that don't need to know about that data might now be aware of it, and
can lead to problems down the line.

But why? Why not just store everything globally?

This is a fairly crucial point—yeah, we're all in agreement that prop drilling
is generally bad, but why not just stick everything in a global store, using
something like Pinia or Vuex?

We'll be going more into depth on this subject later in the article, but a
couple of the biggest reasons are:

- It allows us to use the component requiring that data in more one than one
  context—or in other words, it allows us to have multiple instances of the
  component providing the data on the screen at the same time.
- It can be desirable to have the data attached to the lifecycle of a component,
  so that when you navigate away from the page, the data is released from
  memory. Of course, this isn't always desirable, and in those cases you
  probably do want to use some sort of global store, or a state management tool
  like Apollo Client or TanStack query.

### Simplicity

After all this talk of principles and patterns, it's often enough just to know
that using provide / inject can be significantly simpler to implement and reason
about than alternative ways of passing the data down. We'll look at some cases
later on which demonstrate this.

## How to use provide / inject

Okay, hopefully you're sold on the idea of at least trying out provide / inject.
(and if you're not, hopefully the examples later on in the article convince you
and you can revisit this section!)

We've already looked at how to use provide / inject using JavaScript, but let's
take a look at it first using TypeScript, and then using the options API.

One thing you might have wondered when reading the earlier code example is how
the component `inject`ing the data knows the type of the data being passed down
to it. It wouldn't be great if we had to cast the data everywhere it was used or
just didn't have any typing!

There's a couple ways of approaching this, one of which I'd recommend in pretty
much all cases, the other of which I've seen used a few times in the past which
I'll explain in case you see it yourself.

The first thing you need to know is that in addition to supporting strings as
keys, it also supports Symbols[1].

[1]: Symbols are a way of creating an identifier or key that is completely
unique. You can read more about it on MDN:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol>

We can use a symbol as follows:

```typescript
import { computed, provide } from 'vue';
import { useServerInfo } from './composables/server-info';

const serverId = computed(() => /* get from props */);

export const serverInfoKey = Symbol();
const serverInfo = useServerInfo(serverId);

provide(serverInfoKey, serverInfo);
```

Then, components that need to `inject` the data stored in `serverInfo` can
import `serverInfoKey` and use that as follows:

```typescript
import { inject } from 'vue';
import { serverInfoKey } from '../../some/path';

const serverInfo = inject(serverInfoKey);
```

In addition to this reducing the chance of key collisions, Vue also gives us a
way to use this to specify the type of the provided data in the form of the
`InjectionKey` interface, which extends `Symbol`. It can be used as follows:

```typescript
import { computed, provide, type InjectionKey } from 'vue';
import { type ServerInfo, useServerInfo } from './composables/server-info';

const serverId = computed(() => /* get from props */);

export const serverInfoKey = Symbol() as InjectionKey<ServerInfo>;
const serverInfo = useServerInfo(serverId);

provide(serverInfoKey, serverInfo);
```

Then, any instance of `inject` using `serverInfoKey` will have a return type of
`ServerInfo | undefined`—`undefined` as a component can't be certain that any of
its ancestors has actually provided the requested data.

You can of course use primitive types like `string` as the argument for
`InjectionKey`, or you can specify the object type directly, or you can even do
something like `InjectionKey<ReturnType<useServerInfo>>`.

The other approach, which works when using strings or symbols as keys, is to
pass the type to `inject` using a generic type argument, like this:

```typescript
import { inject } from 'vue';
import type { ServerInfo } from './composables/server-info';

const serverInfo = inject<ServerInfo>('server-info');
```

I wouldn't recommend using this approach unless you have to as it's easier to
accidentally use the wrong type, or have the type you're using go out of date.

### Passing data up the tree

Okay, we've handled passing data downwards, but how can components let the
component that provided the data know that a descendent wants to perform an
action from the data?

An example leading on from the example we used in the "lifting state up" section
where we lifted our users out of our message components and into a higher
component could be the existence of an "Block user" action that can be called
directly from the user profile preview popup. We'd want both to mutate the user
object so that the client knows that that user is blocked, and also hide any
messages from that user that are also displaying on screen. Clearly, those
actions lie far outside the responsibility of the profile preview popup, so we
need some way of letting the component at whatever level we decided should be
responsible for that data know that the current user has performed that action.

Your instinct might to have been to reach for Vue's component events[link], but
component events don't bubble, and for the same reason we don't want prop
drilling downwards, we don't want a chain of components passing an event back
upwards either.

The approach I generally recommend is to pass a function along with the data
into the `provide` function, which can then be called to mutate the data or
perform an action. In this example, let's say that the user profile popup
handles the fetching logic itself to let the server know that the current user
wants to block another user, so all we have left to do is update the object
representing that user. It might look like this:

```typescript
import { provide, ref, type InjectionKey, type Ref } from 'vue';
import { User } from './models/user';

const users = ref<User[]>([]);

interface UsersProvider {
  users: Ref<User[]>;
	storeUser(user: User): void;
	updateUser(id: User['id'], updatedData: Partial<User>): User;
}

const usersProvider: UsersProvider = {
  users,
	storeUser(user: User) {
		users.value.push(user);
	},
	updateUser(id: User['id'], updatedData: Partial<User>) {
		const user = this.getUser(id);
		Object.assign(user, updatedData);
		return user;
  }
};

export const usersProviderKey = Symbol() as InjectionKey<UsersProvider>;

provide(usersProviderKey, usersProvider);
```

This is quite an unrealistic example, as it's almost certain that in a case like
this you'd want some sort of global state management tool, but hopefully
demonstrates an approach for passing data back up to the component responsible
for the data. Plus, it's a neat look into how you might approach developing your
own global state management tool!

Another approach to modifying the data is to just modify it directly, which is
possible by default when passing in a ref, reactive object, or some other kind
of reactive object. I wouldn't recommend this approach—in fact, I'd recommend
specifically protecting against it, which I'll demonstrate in the best practices
section later on.

Finally, depending on the kind of data you're providing, you might be able to
just interact directly with the router in your component that consumes the
provided data. For example, if the current user clicks through to the full
profile from a user's profile preview popup, it's often easier to just handle
the navigation directly from the profile preview popup—although be aware of the
impact that will have on the testability of that component, which now has to be
aware of the router. The flip side of that is that the parent component doesn't
have to be aware of the navigate to full profile action, though! There's no
approach that works in every situation, here.

### Wrapping `inject` in a composable

I really like the approach of wrapping calls to `inject` in composable functions
which handle that logic for you, and some other logic that you'd want in
multiple places—for example, an `undefined` check which throws an error if the
data isn't provided by an ancestor.

For example, this code will throw an error:

```typescript
const { getUser, storeUser, updateUser } = inject(usersProviderKey);
```

The reason for this is that the return type of that `inject` call is
`UsersProvider | undefined`, and `undefined` can't be destructured.

We can create a composable to wrap the `inject` call and handle that case like
this:

```typescript
function useUsersProvider(): UsersProvider {
  const usersProvider = inject(usersProviderKey);
  if (!usersProvider) {
    throw new Error('User provider was not provided');
  }
  return usersProvider;
}
```

Then, we can use `userUsersProvider()` as a destructurable value, as we've
eliminated the possibility it'll return `undefined`:

```typescript
const { getUser, storeUser, updateUser } = useUsersProvider();
```

We can also go one step further and create two exposable functions: one for
components to `provide` data to components, and the other to `inject` that data
and perform common actions on it. At this point, we no longer need to export
`usersKey`, and we now have complete control over the data in one place—we don't
have to worry about a component further down the tree doing something weird with
the data.

```typescript
import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';
import { User } from './models/user';

const usersKey = Symbol() as InjectionKey<Ref<User[]>>;

export function useProvideUsers() {
  const users = ref<User[]>([]);
  provide(usersKey, users);
}

export function useUsers() {
  const users = inject(usersKey);

  if (!users) {
		throw new Error('useProviderUsers() not called by any ancestor');
  }

  return {
    users,
    storeUser(user: User) {
      users.value.push(user);
    },
    updateUser(id: User['id'], updatedData: Partial<User>) {
      const user = this.getUser(id);
      Object.assign(user, updatedData);
      return user;
    }
  };
}
```

### App-level provides:

If you actually do want to go ahead and use provide / inject for global storage,
you can provide it to your entire app using `app.provide`:

```typescript
import { createApp, ref } from 'vue';
import { usersKey } from './providers/users';
import type { User } from './models/user';

const app = createApp({});

app.provide(usersKey, ref<User[]>([]));
```

Although, in this specific case, I'd probably recommend moving most of that
logic into the users provider, possibly in the form of a plugin:

```typescript
import { ref, type App, type Plugin } from 'vue';

export function createUsersProvider(): Plugin {
	return {
		install(app: App) {
			const users = ref<User[]>([]);
			app.provide(usersKey, users);
		}
	};
}
```

Then, you can replace your original `app.provide` call with an `app.use` call:

```typescript
import { createApp } from 'vue';
import { createUsersProvider } from './providers/users';

const app = createApp({});

app.use(createUsersProvider());
```

This ensures as little knowledge of what's happening in the users provider as
possible in that file—another good example of the principle of least knowledge!

As a side note, if you're starting to think this is looking a lot like how a
global state management tool might work... you're not wrong!
<https://github.com/vuejs/pinia/blob/0d29ed3f4f8da157e11d9391687739d562f014ee/packages/pinia/src/createPinia.ts#L22-L38>

### Usage with the options API

It's also possible to use provide / inject with the options API, although it's a
bit more convoluted and you lose some type safety when using TypeScript—you'll
have to cast injected values to their correct types as they're `any` by default.

To provide data using the options API, you can use the `provide` property:

```typescript
export default {
  data() {
    return { users: [] };
  },
  provide() {
    return { users: this.users };
  },
};
```

Then, to consume it in a child component, you can use the `inject` property:

```typescript
export default {
  inject: ['users'],
  mounted() {
    console.log(this.users);
  },
};
```

Note that the injected `users` value isn't reactive. If you want to know how to
do that, or anything else with the options API, I'd recommend checking out the
official Vue docs: <https://vuejs.org/guide/components/provide-inject.html>

If you're seeing documentation for the composition API, you can use the toggle
at the top of the sidebar to change to the options API.

## Alternative approaches

- global state - vuex / pinia
- global state - apollo store / tanstack query
- slots
- prop drilling

## Best practices

- Don’t make components too far down too aware of the overlying data - talk
  about testability. apply it to current global state best practices
  - Aka, avoid deeply nested provide / inject
  - Prop drilling isn’t just a problem in itself, but can be a symptom of a
    wider problem with how you’re using components
- Don’t use when slots can be used instead - e.g. layout components shouldn’t
  have any knowledge of how they’re used, so prop drilling isn’t a problem that
  should be solved
  - talk about floating user preview
    - used outside context of server, e.g. in private messages
    - sections are slightly different but largely the same
    - good architecture would be base component with slot support, then a
      component that extends that to pass in the server-specific stuff
- Use symbol keys
- Be mindful of component lifecycle - data can be destroyed
- Wrap in composables (but this is my advice, not common practice)
  - Make composables name good

## Examples

- Reduce prop drilling
- Reduce dependence on global state
  - Example: messaging app with sidebar of conversations
    - Make it clear that messaging app is a small part of a larger app
    - Or maybe not sidebar? Maybe popup app like Facebook messenger
    - Cover case where data is used in multiple places, e.g. pop-up
      conversations or full screen conversations
    - Case where maybe not appropriate: popup conversation has “go full screen”
      mode
  - Some sort of product listing where product item has many children
    - Maybe product item is reused in both product page and listing?
    - Maybe pattern is reused in search bar at top of page?
  - Something kind of out there? Like data for levels in a game maybe?
- As a simple global store
- To provide an event bus
- Theme ui
- Find other examples from react community
-

## Close

---

things to review:

- “deeply nested child” - nope, it’s not a child any more, it’s a descendant /
  component
- typescript by default, but talk about javascript too
- options API still exists
- components can’t do non-default exports, so symbol keys have to be in another
  file—make it clear what’s a component and what isn’t
