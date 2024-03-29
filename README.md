# DISCONTINUATION OF PROJECT #  
This project will no longer be maintained by Intel.  
This project has been identified as having known security escapes.  
Intel has ceased development and contributions including, but not limited to, maintenance, bug fixes, new releases, or updates, to this project.  
Intel no longer accepts patches to this project.  
  

---

### <b>Join Hackathon [Open Your Mind to Endless Possibilities](https://software.seek.intel.com/OpenVisualCloudHackathon-contest?cid=diad&source=github_display_int&campid=ww_q1_2021_ovc_iotg&content=cont-reg_all)<br>Registration: Jan 11 - March 12, 2021</b>   

---

The video conferencing sample implements a web meeting demo based on Open WebRTC Toolkit (OWT) media server and client SDK, which fully demonstrates OWT media processing features in both mix and forward modes. It also provides basic conferencing actions like screen sharing, instant messaging, and meeting control in web UI.

<img src="web-meeting/app-server/html/img/web-sample.jpg" width="800">

### Install docker engine:        

(1) Install [docker engine](https://docs.docker.com/install).     
(2) Install [docker compose](https://docs.docker.com/compose/install), if you plan to deploy through docker compose. Version 1.20+ is required.    
(3) Setup [docker swarm](https://docs.docker.com/engine/swarm), if you plan to deploy through docker swarm. See [docker swarm setup](deployment/docker-swarm/README.md) for additional setup details.    

### Setup docker proxy:

```bash
(4) sudo mkdir -p /etc/systemd/system/docker.service.d       
(5) printf "[Service]\nEnvironment=\"HTTPS_PROXY=$https_proxy\" \"NO_PROXY=$no_proxy\"\n" | sudo tee /etc/systemd/system/docker.service.d/proxy.conf       
(6) sudo systemctl daemon-reload          
(7) sudo systemctl restart docker     
```

### Build docker images: 

```bash
(1) mkdir build    
(2) cd build     
(3) cmake ..    
(4) make     
```

### Start/stop services:

Use the following commands to start/stop services via docker swarm:    
```bash
(1) make start_docker_swarm      
(2) make stop_docker_swarm      
```


### Launch browser:

Launch your browser and point to `https://localhost` to join the video conference. Note that the default certificates are self-signed with limited lifetime for demo purpose only. Suggest to replace them with your own key pairs with trusted certificates. You may need to confirm the self-signed certificate exception to continue if default certificates are used for demo purpose.  
Video Conferencing Sample has been tested on following browsers: Chrome 75, firefox 67
