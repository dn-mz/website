---
layout: post
title: "Pain points in robot research"
date: 2026-03-13
description: "As identified in RoboPapers by Haptic Labs."
tags: [ai, robotics]
---
There's a podcast called RoboPapers where robotics researchers are invited to share their recent work. Some very interesting articles have been shared, though the gold mine is in the conversations had over the podcast that also capture what the researchers are *thinking* about, instead of what they have just *thought* (and researched) about.

Haptics Labs did a bit of that analysis in [this post](https://www.hapticlabs.ai/blog/2026/03/06/plenty-of-room-in-physical-ai-research){: .custom-link}. It's somewhat a sentiment/semantic analysis of what topics came up in conversations, and then fairly straightforward data analysis to see how often a "pain point" is mentioned. (Reminds me of my undergraduate thesis!)

The approach is not foolproof as conversations may have been outdated, and it would be interesting to see what are the more recent "pain points" identified, but it does provide quite a good overview of problems that still exist in robotics today. It'll also be interesting to see a "pain points" (y-axis) vs time (x-axis) comparison, as that adds a layer of insight to how current the "pain point" is in researchers' minds.

Here are their results:

1. Scalable robot (and human-robot) data collection (22/64) - Collecting high-quality robot data is still slow, expensive, and hard to scale.
2. Generalization and zero-shot robustness (12/64) - Policies often fail when objects, tasks, or environments shift beyond training conditions.
3. Dexterous and contact-rich manipulation (10/64) - Multi-finger control and force-aware contact handling remain difficult in real tasks.
4. Teleoperation and whole-body data collection (10/64) - Current teleop setups are uncomfortable, limited, and hard to scale for whole-body behavior.
5. Sim-to-real and simulation environment creation (10/64) - Building useful sims takes major effort, and transfer to real robots is still fragile.
6. Evaluation and benchmarking at scale (9/64) - Reproducible real-world evaluation is costly and hard to standardize across labs.
7. VLAs, foundation models, and world models for control (8/64) - General-purpose models still struggle with reliability, 3D reasoning, and control alignment.
8. Human video / human-to-robot transfer (6/64) - Human demonstrations lack robot-ready actions, dynamics, and embodiment compatibility.
9. Long-horizon and memory (6/64) - Most policies are weak on long sequences and memory-dependent decision making.
10. RL scaling and offline-to-online (6/64) - Exploration, data efficiency, and pushing reliability toward deployment-grade performance remain open.

One thing obviously missing is deployments, but that's not surprising as conversations focus more on research work. And that's the stuff I like to do. Haptics Labs does mention that, saying this list focuses on research and not deployments, and points to a piece by A16Z on [deployment gaps](https://www.a16z.news/p/the-physical-ai-deployment-gap){: .custom-link}. Fair point, though one of the big learning points I have from Servo/Ezer is that the research/deployment gap is one that necessarily needs to be crossed, and deployment will lead to much, much better research. 

Overall, a great analysis to map out pain points in the industry.

DNMZ
