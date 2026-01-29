---
layout: post
title: "Why robotics"
date: 2025-12-31
description: "Robots, learning robots, and robot learning."
tags: [ai, robotics]
image: /daniel-photo.jpg
---

![Robot](/assets/images/laundry_robots.gif)
*My teleoperated robots, folding laundry in a facility in UK.*

Putting aside my team's second-placing on day two of the 2003 National Junior Robotics Competition, my first deep look into robotics was after founding JustShip in 2020. At JustShip, we built a great tech-ops stack to streamline many operationally tedious processes for our customers, logistics partners and ourselves. Naturally, this involved looking at processes in the physical warehouse to automate with tech. Packing. Boxing. Retrieval. Sorting. Putting things in the right places. *Enter robotics.*

__*Robotics, then*__

It was 2020 then, and robotics wasn't yet quite ready. I looked into various options, but many didn't make sense. Machines half the size of our meeting room; six-figure price tags with unit economics that don't add up; tons of limitations and edge cases; and lots of manual intervention required still. The robots mostly worked, some of the time, for a few use cases; thus, there were not many ideal customers. It's not to say robotics didn't work at all in 2020. It just didn't make sense, at least for JustShip then, if things didn't work generally nor all the time.

__*Robotics, now*__

It's 2025. Robotics isn't yet quite ready, still. But massive developments in hardware have brought the cost of robots down to low four figures, and even greater developments in AI and software (no elaboration required here) have led to significant unlocks in robotics - specifically, AI robotics. I can go on about the specifics of the technology, promise of general purpose robotics, interesting open-source models, and fascinating behind-the-scenes work and whispers I've heard. The important thing: the limitations I saw in industrial robotics in 2020 no longer exist with AI robotics now in 2025.

Don't get me wrong - there are still plenty of limitations. There are many, many new challenges in the AI robotics space. Yet, AI robotics has ushered in a new type of robot work. Robots have reduced in size, prices gone down, can be generalisable, and now can (purportedly/potentially) perceive, think, and react. 

I'm not going to go into specifics of the model, data or compete; nor my opinions on data, deployment or form factor. There have been many recent developments that have fascinated me. But I'll document those learnings over the next few weeks and months.

For now, I'm going to reflect on two things: *learning robots*, and *robot learning*.

__*Learning robots*__

Given my background, the question is: how am I supposed to learn robotics? Or, how did I learn robotics? I don’t have a degree in engineering (yet). I haven’t spent years mastering control systems or inverse kinematics (yet), and there is still much I don’t know about sensors (yet).

I entered the field by tinkering with a friend. He built the tech stack for teleoperation and a VLA (Vision-Language-Action) policy; I focused on scaling data, quality control, hardware maintenance, and managing operations. This threw me head-first into the challenge of robotics - the tricky, unglamorous bits like USB cable matters (especially with three cameras!), RAM latency, actuator calibration, and the complexities of leader-follower teleop set-ups.

Within two months, we saw incredible results. We built a data collection engine with 30 operators that generated high-diversity datasets, deployed across multiple real businesses in the UK (including an insect farm!) with more in the pipeline. Our models were performing at SOTA levels. I remember how excited we were when we saw our robots come to life, and improve with the regular iterations we had.

We went to SF to raise money, including flying our robots down to SF, received significant funding (almost $10M), but on the day the deal was to close, we decided not take it. It's a much longer story and post-mortem here, for another time.

Since then, I've focused on building my "robot intuition". I've built a mobile base for my robot arms to get my hands dirty with circuits, motors, and coding the software of the mobile base; trialled simulations and other collection methods (UMI); and set up various systems (GPUs, 3D printers, much more). There's a lot happening in the robot data space right now, and many are trying to enter the space. I've been really impressed by some approaches, slightly skeptical about others, and overall am focusing on learning robots deeply, to deliver results powerfully for the real world. On that note, many companies have reached out to me to chat and leverage my experience, and I'm happy to [chat](/book){: .custom-link}. 

__*Robot learning*__

Thus my thesis on robot learning. Putting aside traditional industrial robotics, and focusing on AI robotics, the space is quite fragmented much like the early LLM landscape. Companies tend to focus on individual parts of the process - hardware, software, research, data, labelling - and that makes sense. 

However, I think things are a little more challenging in robotics. I may be an idealist: **the best robot foundation models must be developed with view over the entire stack**. Models must be built in tandem with hardware, software, data collection and deployment. That allows for iteration across all parts of the robot stack. What is "high quality data" if it isn't tailored to the specific form factor of the robot? How do we figure out things like occlusion (and do we need to)? Should we build in other senses like touch or sound into the robot or model? How should we think about the tokens required with three or so cameras?

Then comes deployment. The industry is rushing to collect data in diverse environments - which is great - but it is unclear how the ROI will be delivered. It is not yet clear how this diversity will translate to real world deployment and use. **I believe that robot data collection is best if done in tandem with real world deployment, with companies that will actually use these robots**. I've had tons of very intelligent VCs and roboticists tell me we're in the early days of AI robotics, much like the GPT-1 era, and use case is something that OpenAI only thought about much later. I don't disagree. Though I think that if we consider what robots' GPT-4 looks like; learn from lessons in the LLM space; and build with use cases in mind; we will collect better data and deploy better robot models in the world. 

Model, data and deployment must be a closed loop, ideally with real world partners willing to invest time to see the fruits of the labour. Unlike LLMs, where the public can be "testers", robots require manual deployment and physical iteration before the models can truly be deployed for real world use. It's operationally tedious. But we can build processes and stacks to solve that. I think that's the best way for robots to learn.

Happy New Year's Eve, and wishing you a very blessed 2026 ahead.

**DNMZ**

