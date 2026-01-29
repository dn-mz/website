---
layout: post
title: "Ready, Jet Set, Go"
date: 2026-01-13
description: "Jet lag, vibe coding - and reflections on AI wrappers, digital enmeshment and future industries."
tags: [ai]
---
I was back in Singapore for a work trip recently, advising on some M&A matters. Before I flew back to London, a friend who knew I experienced terrible jetlag on the way in asked, "Do you have a flight plan to reduce jetlag on your way back?"

I mentioned a rough outline, then thought. Hmm, I'm sure AI would have more insight than me on this.

So I came back to London, and vibe coded it. I know, there are already apps and full businesses doing this. But I’m not keen on paying $25 per trip to know when is best for me to sleep or what to eat. It was a good opportunity to refresh my coding, and vibe coding, skills and build a product I'd use.

The result is [Ready Jet Set Go](https://readyjetsetgo.daniel.ventures){: .custom-link}. Here are some reflections from the build.

**1. The "AI Wrapper" is not enough**
Back in 2023, companies that were AI wrappers could raise tens of millions. Even hundreds. That's increasingly less possible now, and simple AI wrappers are inceasingly saturated. If Ready Jet Set Go is just a chatbot where I have to manually type in my flight details, I might as well just use ChatGPT or Gemini. For a tool like this to be valuable, it must prioritize usability.

So I designed Ready Jet Set Go to be fuss-free: key in a flight number, and the app retrieves the data for you. In a world of LLMs, the "moat" isn't the AI model itself; it's the UX, the specific data integration, perhaps community, and how effectively you solve a friction point without making the user work for it.

**2. The Invisible Plumbing of Vibe Coding, and Digital Enmeshment**
"Vibe coding" feels incredibly easy, but relies on a massive amount of invisible plumbing. For example, to keep my Gemini API keys secure, I used Vercel’s Serverless Functions to build an API proxy. This kept my frontend light while the "back room" handled the heavy lifting. 

The tricky thing about this modern workflow is the web of dependencies it creates. To get things Ready Jet Set Go running, I’m leaning on a stack of SaaS providers - Vercel for hosting, Google for AI credits, airline data scrapers for flight info (eventually didn't use this). 

I recall trying to do most things inhouse in JustShip's early days. We did, but after a while realised that using SaaS or building on top of SaaS is just much faster. Even more so today. To move fast and *just ship*, SaaS is a massive amplifier. It creates incredibly useful abstractions that allows a single developer to build what used to require a whole team. 

On a philosophical level, this reminds me of enmeshment in International Relations constructivist theory. In IR, enmeshment suggests that deep interdependence leads to stability because interests become aligned. Perhaps the same is true for the web; our tools are more powerful because they are no longer "islands" but part of a shared architecture.

Yet, there are risks. If one node fails, the integrity of the whole web is called into question. ASEAN is a prime example of enmeshment, yet the Cambodia-Thailand border conflicts often make its collective value feel fragile. In the digital world, if the software we rely on fails or shifts its terms, what becomes of the apps we’ve built. We trade autonomy for speed, but in doing so, we become vulnerable to the stability of the ecosystem at large.

No easy answers here and, for what it's worth, I use SaaS.

**3. APIs and can we imagine the future?**
As alluded to above, I went for an AI search-based tool rather than a dedicated airline API subscription—mostly because this is a hobby project and I’m not looking to manage monthly overhead. However, going down the rabbit hole of airline data made me realise just how much information we track in the flight industry. It's incredible.

I doubt the early pioneers of flight could have imagined the flight industry as we see today. Data heavy, many different components, incredibly precise tracking and more. In a similar vein, perhaps the robotics industry of tomorrow (maybe robot identities, relationship parameters, tracking, and complex regulation) will likely be just as unimaginable to us now.

It's exciting though also very daunting!

**What’s next?** 

I don't plan to turn this into a massive startup. I’m simply going to use it as a guide for my own travels. That said, I can see possibilities of how this can expand (execution notwithstanding). Integrating recommendations for wellness products or physical supplies like compression socks and aromatherapy. 

There is definitely space in the human performance industry, and I have friends in that space who are doing incredible work. For now, though, I’m grateful for the (vibe)code learnings, deeper reflections, and am happy to keep it as a useful tool that doesn't cost me $25 a trip.

**DNMZ**

![Vercel](/assets/images/vercel-just-ship.jpg)
*Vercel - particularly like how they use "just ship"*