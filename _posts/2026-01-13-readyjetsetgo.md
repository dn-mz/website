---
layout: post
title: "Ready, Jet Set, Go"
date: 2026-01-13
description: "Jet lag, vibe coding - and reflections on AI wrappers, digital enmeshment and future industries."
tags: [ai]
---
I was back in Singapore for a short trip recently, advising on a M&A deal. Before I flew back to London, a friend who knew I experienced terrible jetlag on the way in asked, "Do you have a flight plan to reduce jetlag on your way back?"

I mentioned a rough outline, then thought... Hmm, I'm no expert, I'm sure AI would have more insight than me on this.

So I came back to London, and vibe coded a flight planner to mitigate jet lag. I know, there are already apps and full businesses doing this. But I’m not keen on paying $25 per trip to know when is best for me to sleep or what to eat (actually, it doesn't even tell me what to eat). It was a good opportunity to refresh my (vibe-)coding skills and build a product I'd use.

The result is [Ready Jet Set Go](https://readyjetsetgo.daniel.ventures){: .custom-link}. I've logged my technical learnings in my learning journal; and here are my non-technical reflections from the day and a half I spent building.

**1. The "AI Wrapper" is not enough**
Back in 2023, companies that were AI wrappers could raise tens of millions. Even hundreds. That's increasingly less possible now, and simple AI wrappers are inceasingly saturated. If Ready Jet Set Go is just a chatbot where I have to manually type in my flight details, I might as well just use ChatGPT or Gemini. For a tool like this to be valuable, it must prioritize usability.

So I designed Ready Jet Set Go to be fuss-free: key in a flight number, and the app retrieves the data for you. Click some parameters about yourself, and let the AI do the work. In a world of LLMs, the "moat" isn't the AI model itself; it's the UX, the correct data integration, perhaps community, and how effectively you solve a friction point without making the user work for it.

**2. The Invisible Plumbing of Vibe Coding, and Digital Enmeshment**
"Vibe coding" feels incredibly easy, but relies on a massive amount of invisible plumbing. For example, to keep my Gemini API keys secure, I used Vercel’s Serverless Functions to build an API proxy. I also used Google for AI credits (explored OpenRouter, but the free models were not reliable enough especially on search). And considered flight APIs like AeroDataBox for flight information (eventually chose not to use it). 

And that's the tricky thing about this modern workflow - the web of dependencies it creates. I recall trying to do most things inhouse in JustShip's early days. We did, but after a while realised that using SaaS or building on top of SaaS is just much faster. This is even more true today. To move fast and *just ship*, SaaS is a massive amplifier. It creates incredibly useful abstractions that allows a single developer to build what used to require a whole team. 

On a philosophical level, this reminds me of enmeshment in International Relations constructivist theory. In IR, enmeshment suggests that deep interdependence leads to stability because interests become aligned. Perhaps the same is true for the web; our tools are more powerful because they are no longer "islands" but part of a shared architecture.

Yet, there are risks. If one node fails, the integrity of the whole web is called into question. ASEAN is a prime example of enmeshment, yet the Cambodia-Thailand border conflicts casts doubt on ASEAN's value. In the digital world, if the software we rely on fails or shifts its terms, what becomes of the apps we’ve built? We trade autonomy for speed, and in doing so, we become vulnerable to the (in)stability of the ecosystem at large.

No easy answers here and, for what it's worth, I use SaaS.

**3. APIs and can we imagine the future?**
As alluded to above, I went for an AI search-based tool rather than a dedicated airline API subscription, mostly because Ready Jet Set Go is for fun, and I’m not looking to manage monthly overhead. However, going down the rabbit hole of airline data made me realise just how much information we track in the flight industry. 

It's incredible.

The early pioneers of flight would likely not have imagined the scale and magnitude of the flight industry we see today. Safety regulations, many different components and sub-industries, incredibly precise tracking and the very rich data involved (all for the price of $0-150/month for the API!). 

In a similar vein, I think the robotics industry of tomorrow will likely be just as unimaginable to us now. Definitely safety regulations, model safeguards. Maybe robot identities, relationship parameters, ID tracking... and just imagine how law might change!

It's exciting though also very daunting!

**What’s next?** 

I don't plan to turn Ready Jet Set Go into a startup. I’m simply going to use it as a guide for my own travels. That said, I can see possibilities of how this can expand (execution notwithstanding). Integrating recommendations for wellness products or physical supplies like compression socks and aromatherapy. 

There is definitely space in the human performance industry, and I have friends in that space who are doing incredible work. For now, though, I’m grateful for the (vibe)code lessons, deeper reflections, and am happy to keep it as a useful tool that doesn't cost me $25 a trip.

Back to robot learning.

**DNMZ**

![Vercel](/assets/images/vercel-just-ship.jpg)
*Vercel - particularly like how they use "just ship"*