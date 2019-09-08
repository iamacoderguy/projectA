# projectA

_This project poster is following the template at https://www.atlassian.com/team-playbook/plays/project-poster_

### How does this project fit with the strategy?

projectA is the first one of 26 projects from A to Z that I intend to develop on the way to become a full-stack developer.

projectA will last in one month from Aug 10 to Sep 10. Hope that it can contain basic knowledge of full-stack system development including front-end, back-end, and DevOps.

Team project owner |
------------------ |
@iamacoderguy      |

Team members  | Project status: Active / Inactive / Shipped
------------- | -------------------------------------------
@iamacoderguy | Active
@luyendt      | Active
@Dienvm       | Active


## Problem space 
### Why are we doing this?
PROBLEM STATEMENT: Need for one who is looking for a sample system that requires basic knowledge of front-end, back-end, and DevOps to build.

IMPACT OF THIS PROBLEM: I have two years' experience of mobile development in Xamarin and that's it. My job is at risk. I can be fired at any time and it's hard to find a new one with Xamarin experience in my country. There are many things to learn, but not enough time for me for learning anything deeply. The best way for me to learn a thing is from practicing. So I would like to implement my ideas one by one to help me learn about the high-demand domain knowledge in my area. A system that requires basic knowledge of front-end, back-end and DevOps is a good starting point for me.

### How do we judge success?
The project will be finished if:
- [ ] We finish developing a system which involves a server (back-end) and one or more clients (front-end)
- [x] The system can run, do one or more useful tasks and everyone can use it with some configurations
- [x] The system doesn't need to run online, on-cloud. It can use a LAN.
- [x] No master how many features the system has.
- [ ] The system must be continuously integrated and continuously delivered.

### Possible solutions
1. Play a mini game with an auto bot from the server
1. Play a mini game with friends via LAN
1. An authentication system (sign up and sign in).
1. Randomly show a thing (such as a motivation quote or a video from Youtube).
1. __File transfer between PC and mobile or PC and PC__

I've chosen the last one. So we're implementing a system that enables end-users to transfer their files between their PCs or their mobiles. For more information, please refer to [What are we doing?](#wawd)

## Validation
### What we already know?
We will choose frameworks to implement the solution based on the roadmap at https://github.com/kamranahmedse/developer-roadmap (maybe JS related frameworks).
We take ownership of defining of done.

### What do we need to answer?
No, just do it, then we will explore.

## Ready to make it
### <a name="wawd"></a>What are we doing?
The project will deliver a solution including:
1. Client applications:
   * A mobile application (Android or iOS or both)
   * A desktop application (desktop or web app or both)
1. A server package which is able to install and run on Windows

The clients can connect ([#18](https://github.com/iamacoderguy/projectA/issues/18):ballot_box_with_check:, [#22](https://github.com/iamacoderguy/projectA/issues/22):ballot_box_with_check:, [#9](https://github.com/iamacoderguy/projectA/issues/9), [#10](https://github.com/iamacoderguy/projectA/issues/10)) to the server if they're in a same LAN, then
* Upload files to the server's shared folder ([#15](https://github.com/iamacoderguy/projectA/issues/15):ballot_box_with_check:, [#3](https://github.com/iamacoderguy/projectA/issues/3), [#4](https://github.com/iamacoderguy/projectA/issues/4))
* Browse files from server ([#21](https://github.com/iamacoderguy/projectA/issues/21):ballot_box_with_check:, [#30](https://github.com/iamacoderguy/projectA/issues/30):ballot_box_with_check:, [#5](https://github.com/iamacoderguy/projectA/issues/5), [#6](https://github.com/iamacoderguy/projectA/issues/6))
* Download files from the server's shared folder ([#17](https://github.com/iamacoderguy/projectA/issues/17):ballot_box_with_check:, [#7](https://github.com/iamacoderguy/projectA/issues/7), [#8](https://github.com/iamacoderguy/projectA/issues/8))
* Disconnect from the server ([#19](https://github.com/iamacoderguy/projectA/issues/19):ballot_box_with_check:, [#11](https://github.com/iamacoderguy/projectA/issues/11), [#12](https://github.com/iamacoderguy/projectA/issues/12))
  
The release package also includes a CI/CD system for the above solution.

### Why will a customer want this?
It can help us to learn about basics of front-end (the clients), back-end (the server) and DevOps (the CI/CD system).

### Visualize the solution
![Server Dashboard](https://drive.google.com/uc?export=download&id=1e1GZGuyM5YGZJg-Qet5cijTYy19nDyxu)

![Mobile Client](https://drive.google.com/uc?export=download&id=13vQtbGbeQyumHRLKPXupJxM2y2Iqr999)
![Desktop Client](https://drive.google.com/uc?export=download&id=1y-ddWyFJW_Jt3WbOTl_C1f80DjE1YqcX)

### Scale and scope
The project will last in one month:
* 1st week: Design and choose framework [M2-server](https://github.com/iamacoderguy/projectA/milestone/2):ballot_box_with_check:, [M3-client](https://github.com/iamacoderguy/projectA/milestone/3), [M4-devops](https://github.com/iamacoderguy/projectA/milestone/4)
* 2nd week: PoC (front-end, back-end and DevOps) [M1-server](https://github.com/iamacoderguy/projectA/milestone/1):ballot_box_with_check:, [M5-client](https://github.com/iamacoderguy/projectA/milestone/5)
* 3rd week: Finalize [M6-server](https://github.com/iamacoderguy/projectA/milestone/6):arrow_forward:
* 4th week: Package
