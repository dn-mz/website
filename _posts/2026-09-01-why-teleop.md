---
layout: post
title: "Why teleop?"
date: 2026-09-01
featured: true
description: "Why I bet on teleoperation, and why I think the way for robots to learn better is to put them to work."
tags: [ai, robotics]
---

I'm often asked: why teleop? There are usually two questions underneath. Why teleop data, and why is it better than simulation, egocentric or wearable data? And why don't we sell egocentric or wearable data instead?

Fair questions. Here's how I think about them.

**Why teleop for robots**

Egocentric and wearable data are promising, and the demand for them is huge today. They're good at teaching a model about the world. But a human hand isn't a robot arm. Teleop data is recorded on the robot itself: its cameras, its actions, its joint positions, doing the real task. That's what you post-train on to get a robot working at a site. 

Egocentric data on its own also has limits. Mecka, who collect it, reported that going from 300 hours to 30,000 didn't improve results much ([link](https://x.com/jiahuadong/status/2109706415120040097?s=46){: .custom-link}). Simulation has its own sim-to-real gap.

Simulation, egocentric and wearable data are important, especially in pre-training, and will get some of the way there. Yet, the last mile of getting robots to work will require robot data, whether teleoperated or autonomous with RLHF. It's the data that matches the job. It's the data that puts robots to work.

**Why teleop for business**

Teleoperated robots scale slowly. A robot has to be physically present, in a lab or on a site, and someone has to operate it every day. That's far more work than collecting video or running simulations. It's operationally tedious, there are customer SLAs, and we promise work done.

But that's exactly the point. The only way to learn how to put robots to work is to put robots to work. A customer who needs the work done also helps pay for the learning. That's why we're building a company around deployment, not a data collection business. 

**But not just teleop**

Teleop is not a substitute for autonomy. It's how we get there, while getting paid along the way. At Servo, building foundation models, I learned that autonomous policies weren't yet reliable enough to meet what customers need. So as policies improve, we plug them in and move from teleoperation to telesupervision, with an operator stepping in when the robot needs help. Autonomy is earned, and learned, on the job - when robots are put to work.

![Insect Farm](/assets/images/crickets.gif)

*Teleoperating in an insect farm. I think insect farms are a great use case for robots.*