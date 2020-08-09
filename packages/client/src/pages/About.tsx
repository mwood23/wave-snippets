import React, { FC } from 'react'

import {
  Box,
  Heading,
  Hero,
  Link,
  List,
  ListItem,
  Page,
  Text,
} from '../components'

export const AboutPage: FC = () => (
  <Page wordyPage>
    <Hero mb="6" showAboutSection={false} />
    <Box mb="12">
      <Heading as="h2" mb="3">
        What is Wave Snippets?
      </Heading>
      <Text mb="3">
        Wave Snippets lets you create beautiful, animated snippets of your code
        to help you illustrate complex concepts through motion. It allows you to
        create a series of code steps and describe the code as you go. Once
        you&apos;re finished, a high quality gif and video file is delivered
        straight to your inbox for you to share with the world!
      </Text>
    </Box>

    <Box mb="12">
      <Heading as="h2" mb="3">
        How does it work?
      </Heading>
      <List styleType="disc">
        <ListItem>Add your code step by step</ListItem>
        <ListItem>Add titles and descriptions for each step</ListItem>
        <ListItem>Customize the look and feel</ListItem>
        <ListItem>Export when you&apos;re ready</ListItem>
        <ListItem>
          We take care of the animations, GIF building, video encoding, and
          everything else!
        </ListItem>
      </List>
    </Box>

    <Box mb="12">
      <Heading as="h2" mb="3">
        What&apos;s on the Roadmap?
      </Heading>
      <Text mb="3">
        So many things! Once I was able to export the snippets consistently the
        ideas started flowing. Here are some things I have planned right now:
      </Text>
      <List mb="3" styleType="disc">
        <ListItem>Snippet embeds</ListItem>
        <ListItem>A snippet gallery of the most liked snippets</ListItem>
        <ListItem>Typing effects for a snippet</ListItem>
        <ListItem>Terminal mode effects</ListItem>
        <ListItem>Snippet storage</ListItem>
        <ListItem>One click shares to Twitter and Github</ListItem>
        <ListItem>Export customization</ListItem>
      </List>
      <Text mb="3">
        Have a feature you&apos;d like to request? The best way is to{' '}
        <Link isExternal href="https://twitter.com/marcuswood23">
          reach out to me
        </Link>{' '}
        on Twitter!
      </Text>
    </Box>

    <Box mb="12">
      <Heading as="h2" mb="3">
        How is this Different than Carbon?
      </Heading>
      <Text mb="3">
        <Link isExternal href="https://carbon.now.sh/">
          Carbon
        </Link>
        &nbsp; is an awesome app for images of your code, but it doesn&apos;t do
        videos. It was one of my main inspirations for creating this app, and
        highly recommend checking them out if you want to create static images.
      </Text>
    </Box>

    <Box mb="12">
      <Heading as="h2" mb="3">
        A Big Thank You To...
      </Heading>
      <Text mb="3">
        <b>
          <Link isExternal href="https://carbon.now.sh/">
            Carbon
          </Link>
        </b>
        : Carbon was a big inspiration for me to take this project on an all the
        snippets made from it has made me and a bunch of other people better
        developers.
      </Text>
      <Text mb="3">
        <b>
          <Link isExternal href="https://twitter.com/pomber">
            Rodrigo Pombo
          </Link>
        </b>
        : The author code surfer and another big inspiration to try to make this
        work. His open source work is great and saved the day with thinking
        ahead to break out the core of Code Surfer into its{' '}
        <Link
          isExternal
          href="https://github.com/pomber/code-surfer/tree/master/packs/standalone"
        >
          own package
        </Link>{' '}
        for me to stumble upon.
      </Text>
      <Text mb="3">
        <b>
          <Link isExternal href="https://github.com/tungs">
            Tungs
          </Link>
        </b>
        {/* TODO Backlink to my blog here */}: The author of Timecut and
        Timesnap. Who would have guessed how difficult building gifs and videos
        in the browser would be. I was just about ready to give up on this
        project until I stumbled across{' '}
        <Link href="https://medium.com/@stevetung/recording-javascript-animations-with-timecut-18ec99cf943f">
          this medium post
        </Link>{' '}
        and decided to give it a try.
      </Text>
      <Text mb="3">
        <b>
          <Link isExternal href="https://twitter.com/0xca0a">
            Paul Henschel
          </Link>
        </b>
        : The author of React Spring. Discovering his library a couple years ago
        was a gamechanger for seeing what animations on the web could be. This
        project uses React Spring under the hood to animate between the steps.
      </Text>
      <Text mb="3">
        <b>
          <Link isExternal href="https://github.com/chakra-ui/chakra-ui">
            Chakra UI
          </Link>
        </b>
        : This was my first app using Chakra UI as the design system framework
        and it was a huge relief. Their TS support is good, components work
        great, and it never got in my way like most of design system frameworks
        do. Highly recommend.
      </Text>
    </Box>
  </Page>
)
