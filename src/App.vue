<template>
  <div class="content">
    <!-- <h2 class="header">Analytics Information</h2> -->
    <div class="container">
      <img class="head" src="https://marketing-image-production.s3.amazonaws.com/uploads/e1d51d2a1da71cd72398505a49a577db12e11426f4a63143818246352efd8c386c5d0da4cbb5b8e4a62f39ef7c55e5141833ba41993eb7dde7af19329f08be56.png" alt="">
      <span style="color:  #34537d;">Analytics</span>
    </div>
    <div class="container">
      <hr>
      <div class="row">
        <div class="col-md-3 p-4 pt-4 mb-2 text-white" style="background-color:  #34537d;border: 4px solid white">
          <h4>EVENTS</h4>
          <h5>{{events.length}}</h5>
        </div>
        <div class="col-md-3 p-4 pt-4 mb-2  text-white" style="background-color:  #34537d;border: 4px solid white">
          <h4>USERS</h4>
          <h5>{{user.length}}</h5>
        </div>
        <div class="col-md-3 p-4 pt-4 mb-2 text-white" style="background-color:  #34537d;border: 4px solid white">
          <h4>MODULES</h4>
          <h5>{{this.modules.length}}</h5>
        </div>
        <div class="col-md-3 p-4 pt-4 mb-2 text-white" style="background-color:  #34537d;border: 4px solid white">
          <h4>STUDIES</h4>
          <h5>{{this.studies.length}}</h5>
        </div>
      </div>
    <hr>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <canvas id="bar-chart"></canvas>
        </div>
        <div class="col-md-6">
          <canvas id="user-studies"></canvas>
        </div>
      </div>
    </div>
    <div class="container">
      <canvas id="planet-chart"></canvas>
    </div>
    <div class="container">
      <h2>Events count</h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th scope="col">Event</th>
            <th scope="col">Engagement time (seconds)</th>
            <th scope="col">Users</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, key,index) in eventsCount" :key="index">
            <td>{{getDate(date)}}</td>
            <td >{{event.event}}</td>
            <td >{{event.engagement_time}}</td>
            <td >{{event.user.length}}</td>
            <td colspan="2">{{event.count}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Anlaytics Data</h2>
    <br>
    <table class="table">
      <thead>
        <tr>
          <td>event_date</td>
          <td>event_timestamp</td>
          <td>event_name</td>
          <td>event_params</td>
          <td>user_properties</td>
          <td>user_pseudo_id</td>
          <td>platform</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(items,index) in content" :key="index">
          <td>{{getDate(items.event_date)}}</td>
          <td>{{convertTime(items.event_timestamp)}}</td>
          <td>{{items.event_name}}</td>
          <td width="30%">
            <div v-for="(item,index) in items.event_params" :key="index">
              {{retrieveValue(item)}}
              <hr>
            </div>
          </td>
          <td width="30%">
            <div v-for="(item,index) in items.user_properties" :key="index">
              {{item.key}} : 
              <span v-if="item.value.string_value"> {{item.value.string_value}}</span>
              <span v-else-if="item.value.int_value"> {{item.value.int_value}}</span>
              <span v-else-if="item.value.float_value"> {{item.value.float_value}}</span>
              <span v-else-if="item.value.double_value"> {{item.value.double_value}}</span>
            </div>
          </td>
          <td>{{items.user_pseudo_id}}</td>
          <td>{{items.platform}}</td>
          <!-- {{items}} -->
        </tr>
      </tbody>
    </table>
    <hr>
    
    <!-- {{content}} -->
  </div>
</template>

<script>
import Chart from 'chart.js'
import planetChartData from './planet-data.js'
import barChart from './barChart.js';
import content from './data/data.json';
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      content: content,
      studies: [],
      modules: [],
      events: [],
      eventsCount: {},
      planetChartData: planetChartData,
      barChart: barChart,
      timeSpent: [],
      userData: [],
      user: [],
      userInfo: [],
      userStudies: JSON.parse(JSON.stringify(planetChartData)),
      date: content[0].event_date
    }
  },
  mounted() {
    this.usersData();
    const ctx = document.getElementById('planet-chart');
    const ctx1 = document.getElementById('bar-chart');
    const ctx2 = document.getElementById('user-studies');
    new Chart(ctx, this.planetChartData);
    new Chart(ctx1, this.barChart);
    new Chart(ctx2, this.userStudies);
  },
  created() {
    Array.prototype.contains = function(v) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
      }
      return false;
    };
    this.getUsers();
    this.content.forEach(content => {
      if(content.event_name !== 'session_start') {
        if(!this.events.contains(content.event_name)) {
          this.events.push(content.event_name);
          this.eventsCount[content.event_name] = {}
          this.eventsCount[content.event_name].event = content.event_name
          let ent =  content.event_params.filter(eve => eve.key === 'engagement_time_msec')
          this.eventsCount[content.event_name]['engagement_time'] = Math.floor(ent[0].value.int_value/1000)
          this.eventsCount[content.event_name].count = 1;
          this.eventsCount[content.event_name].user = [];
          this.eventsCount[content.event_name].user.push(content.user_id)
        } else {
          this.eventsCount[content.event_name].count = parseInt(this.eventsCount[content.event_name].count) + 1;
          var et =  content.event_params.filter(eve => eve.key === 'engagement_time_msec')
          if(et.length) {
            this.eventsCount[content.event_name]['engagement_time'] = parseInt(this.eventsCount[content.event_name]['engagement_time']) + Math.floor(et[0].value.int_value/1000)
          }
          if(!this.eventsCount[content.event_name].user.contains(content.user_id)) {
            this.eventsCount[content.event_name].user.push(content.user_id)
          }
        }
      }
    });
    this.dataSet()
  },
  methods: {
    convertTime(time) {
      return new Date(time/1000);
    },
    getDate(date) {
      return `${date.slice(4,6)}-${date.slice(6,8)}-${date.slice(0,4)}`
    },
    dataSet() {
      let dataSet = {
        label: "Time Spent",
        data: [],
        backgroundColor: "rgba(71, 183,132,.5)",
        borderColor: "#47b784",
        borderWidth: 3
      }
      let dataSet2 = {
        label: "User Count",
        data: [],
        backgroundColor: "#00000050",
        borderColor: "#000000",
        borderWidth: 3
      }
      this.events.forEach(e => {
        this.planetChartData.data.labels.push(this.eventsCount[e].event)
        this.planetChartData.data.datasets[0].data.push(this.eventsCount[e].count);
        this.planetChartData.data.datasets[1] = dataSet
        this.planetChartData.data.datasets[1].data.push((this.eventsCount[e].engagement_time/60).toFixed(1));
        this.planetChartData.data.datasets[2] = dataSet2
        this.planetChartData.data.datasets[2].data.push(this.eventsCount[e].user.length);

      })
    },
    retrieveValue(item) {
      if(item.key === 'module') {
        if (!this.modules.contains(item.value.string_value) && item.value.string_value !== '[object Object]') {
          this.modules.push(item.value.string_value)
        }
      } else if(item.key === 'studyId') {
        if (!this.studies.contains(item.value.string_value) && item.value.string_value !== '[object Object]') {
          this.studies.push(item.value.string_value)
        }
      }

      if(item.value.string_value) {
        return `${item.key}:${item.value.string_value}`
      } else if(item.value.int_value) {
        return `${item.key}:${item.value.int_value}`
      } else if(item.value.float_value) {
        return `${item.key}:${item.value.float_value}`
      } else if(item.value.double_value) {
        return `${item.key}:${item.value.double_value}`
      }
    },
    getUsers() {
      this.userStudies.data.labels = [];
      this.userStudies.data.datasets[0].data = [];
      this.userStudies.data.datasets[0].label = 'Studies';
      this.userStudies.data.datasets[0].borderColor = ['#EDDEA4','#f7a072', '#ff9b42']
      this.userStudies.data.datasets[0].backgroundColor = ['#EDDEA485','#f7a07285', '#ff9b4285']
      this.userStudies.type = 'doughnut';
      let users = [];
      this.content.filter(item => {
        for(let i = 0; i < item.event_params.length; i++) {
          if(item.event_params[i].key === 'studyId') {
            let obj = {
              user: item.user_id
            }
            obj.studies = item.event_params[i].value.string_value
            this.userData.push(obj);
          }
          if(item.event_params[i].key === 'engagement_time_msec') {
            let obj = {
              user: item.user_id
            }
            obj.studies = item.event_params[i].value.string_value
            this.userData.push(obj);
          }
        }
        if (!users.contains(item.user_id) && item.user_id !== null) {
          users.push(item.user_id);
        }

      });
      this.user = users
      users.map(user => {
        let useStuds = {
          user: user,
          studies: [],
        }
        this.userData.filter(data => {
          if(data.user === user) {
            if(!useStuds.studies.contains(data.studies)) {
              useStuds.studies.push(data.studies)
              return data.studies
            }
          }
        })
        this.userStudies.data.labels.push(user)
        this.userStudies.data.datasets[0].data.push(useStuds.studies.length - 1);
        return useStuds;
      })
    },
    usersData() {
      this.user.map(u => {
        this.userInfo.push(this.content.filter(c => {
          return c.user_id === u
        }))
      })
      this.userInfo.map(info => {
        let obj = {
        }
        obj.engagement_time = 0
        info.map(params => {
          obj.user = params.user_id
          params.event_params.map(e => {
            if(e.key === 'engagement_time_msec') {
              obj.engagement_time = obj.engagement_time + parseInt(e.value.int_value)
            }
          })
        })
        obj.engagement_time = Math.floor(Math.floor(obj.engagement_time / 1000)/60);
        this.barChart.data.labels.push(obj.user);
        this.barChart.data.datasets[0].data.push(obj.engagement_time);
      })
    }
  }
}
</script>

<style>
.content {
  padding: 10px;
}
.head {
  height: 30px;
  /* background-color: #34537d;
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 999; */
}
.head span {
  color:  #34537d;
}
</style>
