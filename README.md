# 🌊 [Wave Snippets](https://wavesnippets.com/)

![Wave Snippet Intro](https://github.com/mwood23/wave-snippets/blob/master/static/intro.gif)

## Create gorgeous animated snippets to share with the world.

[![Netlify Status](https://api.netlify.com/api/v1/badges/52c21bbc-5b28-40b7-860c-24fd9fcfb53b/deploy-status)](https://app.netlify.com/sites/wavesnippets/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### [Go to App](https://wavesnippets.com/)

Wave Snippets lets you create beautiful, animated snippets of your code to help you illustrate complex concepts through motion. It allows you to create a series of code steps and describe the code as you go. Once you're finished, a high quality gif and video file is delivered straight to your inbox for you to share with the world!

### Features

- 💯 Over 30 supported languages
- 💅 8 different themes to choose from
- 😎 GIF and Video Export
- 🌊 No login necessary
- 🙏 Auth to save your snippet library
- ✏️ Annotate your code with titles and descriptions
- 📸 Customize the appearance of the background and window
- 🔮 4 different physics based animations
- 💰 Line number support
- 📍 99.4% TypeScript
- 💡 Dark mode support

## How Does it Work?

1. Add your code step by step.
2. Add titles and descriptions for each step.
3. Customize the look and feel.
4. Export when you're ready.
5. We take care of the animations, GIF building, video encoding, and everything else!

## Examples

![Python Clamp](https://github.com/mwood23/wave-snippets/blob/master/static/pythonExample.gif)

## Roadmap

There's a ton of things I want to add!

- Snippet embeds
- A snippet gallery of the most liked snippets
- Typing effects for a snippet
- Terminal mode effects
- Snippet storage
- One click shares to Twitter and Github
- Export customization

Want to help or add something else? [Open an issue](https://github.com/mwood23/wave-snippets/issues/new).

## Contributing

PRs are welcome! If you find a bug or have a feature request please file a [Github issue](https://github.com/mwood23/wave-snippets/issues/new). If you'd like to PR some changes, do the following:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then clone it to your local device
2. Go to the repo and run `yarn install && yarn bootstrap`. This project runs on a particular version of yarn and npm so you will need to have the same versions as mentioned in the `package.json`. I suggest using [nvm](https://github.com/nvm-sh/nvm) and [yvm](https://github.com/nvm-sh/nvm).
3. Setup a Firebase project on your personal account
4. Create a `.env.local` file and fill in the following fields

```
REACT_APP_CLOUD_FUNCTIONS_URL
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_DATABASE_URL
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```

3. Run the app with `yarn dev:client`.
4. Make your changes.
5. Submit a PR with your changes.

If you are making changes to the Cloud Functions you will need to create your own Firebase project and deploy it unfortunately. At the time of writing, there is no emulator for Google Storage, and event functions like when a user signs up. Reach out to the maintainer for help setting this up.

## A Big Thank You To...

[Carbon](https://carbon.now.sh/): Carbon was a big inspiration for me to take this project on an all the snippets made from it has made me and a bunch of other people better developers.

[Rodrigo Pombo](https://twitter.com/pomber): The author code surfer and another big inspiration to try to make this work. His open source work is great and saved the day with thinking ahead to break out the core of Code Surfer into its own package for me to stumble upon.

[Tungs](https://github.com/tungs): The author of Timecut and Timesnap. Who would have guessed how difficult building gifs and videos in the browser would be. I was just about ready to give up on this project until I stumbled across this medium post and decided to give it a try.

[Paul Henschel](https://twitter.com/0xca0a): The author of React Spring. Discovering his library a couple years ago was a gamechanger for seeing what animations on the web could be. This project uses React Spring under the hood to animate between the steps.

[Chakra UI](https://github.com/chakra-ui/chakra-ui): This was my first app using Chakra UI as the design system framework and it was a huge relief. Their TS support is good, components work great, and it never got in my way like most of design system frameworks do. Highly recommend.

###### Made by [Marcus Wood](https://marcuswood.io/)
