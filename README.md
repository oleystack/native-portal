
<p align="center" style="font-weight: bold; font-size: 1.5em">@bit-about/native-portal</p>
<p align="center">
<a href="https://www.npmjs.com/package/@bit-about/native-portal"><img alt="" src="https://img.shields.io/npm/v/@bit-about/native-portal.svg" /></a>
<a href="https://bundlephobia.com/package/@bit-about/native-portal"><img alt="Bundle size" src="https://img.shields.io/bundlephobia/minzip/@bit-about/native-portal?label=size" /></a>
<a href="https://codecov.io/gh/bit-about/native-portal"><img alt="" src="https://img.shields.io/codecov/c/github/bit-about/native-portals?token=BuGi92VqnL" /></a>
</p>

## Install

```bash
npm i @bit-about/native-portal
```

## Features

- 100% **Idiomatic React** and 100% Typescript
- Tiny & Efficient
- Does not trigger unnecessary renderings
- **Just works** ™

## Usage

```tsx
import { portal } from '@bit-about/native-portal'

// 1️⃣ Create a portal
const Portal = portal()

// 2️⃣ Wrap your app with Provider
const App = () => (
  <Portal.Provider>
    {/* ... */}
  </Portal.Provider>
)

```


⬜ Set injection target
```tsx
const ComponentA = () => (
  <>
    <Portal.Target />
  </>
)
```


🌀 ...then inject content from elsewhere
```tsx
const ComponentB = () => (
  <>
    <Portal.Injector>
      <Text>Hello!</Text>
    </Portal.Injector>
  </>
)
```

Thanks to this, 
when the `ComponentB` is rendered, 
the `Hello!` sentence will be moved to the `ComponentA`.

## Many portals under one provider
```tsx
import { portal } from '@bit-about/native-portal'

// Declare destinations during portal creation
const Portal = portal('toHeader', 'toMenu', 'toHeaven')
```

⬜ Set injection target using `name` prop
```tsx
const Menu = () => (
  <>
    <Portal.Target name="toMenu" />
  </>
)
```


🌀 ...then inject content using `name` prop
```tsx
const Screen = () => (
    <>
      <Portal.Injector name="toMenu">
        <Text>{'New menu option'}</Text>
      </Portal.Injector>
    </>
  )
```


## Default content
To declare fallback content for portal that is not in use, you can just pass `children` prop to `Target` component.

```tsx
<Portal.Target>
  <Text>{'I am only visible when no content has been injected.'}</Text>
</Portal.Target>
```

## Don't you like the default names?
```tsx
import { portal } from '@bit-about/native-portal'

const {
  Provider: MyAmazingProvider,
  Target: MyAmazingTarget,
  Injector: MyAmazingInjector,
} = portal()

// ... and then

const App = () => (
  <MyAmazingProvider>
    {/* ... */}
  </MyAmazingProvider>
)
```

## Common Questions
##### What happens if I use multiple `Injectors` for one portal at the same time?
It works like a stack. The `Target` will render the latest content. <br/>If the newest `Injector` is unmounted, the `Target` will render the previous one.

##### What happens if I use multiple `Targets` for one portal at the same time?
Each `Target` will display the same content.

##### Do I need to render `Target` before the `Injectors`?
Nope! <br/>
When you render `Target` it will be automatically filled up by the injected content.

##### Is this efficient? What about the re-renders?
Yes. <br/>
Moreover, `Providers` and `Injectors` will be never unecessary re-rendered.<br/>
`Target` rerender only when the latest injected content changes.

## Partners  
<a href="https://www.wayfdigital.com/"><img alt="wayfdigital.com" width="100" height="100" src="https://user-images.githubusercontent.com/1496580/161037415-0503f763-a60b-4d40-af9f-95d1304fa486.png"/></a>

## Credits
- [use-context-selector](https://github.com/dai-shi/use-context-selector) & [FluentUI](https://github.com/microsoft/fluentui) - fancy re-render avoiding tricks and code main inspiration

## License
MIT © [Maciej Olejnik 🇵🇱](https://github.com/macoley)

## Support me 

<a href="https://github.com/sponsors/macoley"><img alt="Support me!" src="https://img.shields.io/badge/github.com-Support%20me!-green"/></a>

If you use my library and you like it...<br />
it would be nice if you put the name `BitAboutNativePortal` in the work experience section of your resume.<br />
Thanks 🙇🏻! 


---
<p align="center">🇺🇦 Slava Ukraini</p>
