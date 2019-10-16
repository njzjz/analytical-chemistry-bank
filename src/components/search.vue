<template>
  <v-container>
    <v-expansion-panel v-model="panel" expand>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>查询</div>
        </template>
        <v-card>
          <v-layout text-xs-center wrap>
            <v-flex xs12 sm5 mx-3>
              <v-select v-model="unitvalue" :items="unit" attach chips label="单元" multiple></v-select>
            </v-flex>
            <v-flex xs12 sm5 mx-3>
              <v-select v-model="typevalue" :items="type" attach chips label="题型" multiple></v-select>
            </v-flex>
          </v-layout>
          <v-layout text-xs-center wrap>
            <v-flex xs12 sm5 mx-3>
              <v-select
                v-model="difficultvalue"
                :items="difficult"
                attach
                chips
                label="难度"
                multiple
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-btn color="default" @click="search(unitvalue, typevalue, difficultvalue)">查询</v-btn>
          </v-layout>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>出题</div>
        </template>
        <v-card>
          <v-layout text-xs-center wrap>
            <v-flex xs12 sm5 mx-3>
              <v-select v-model="unitvalue" :items="unit" attach chips label="单元" multiple></v-select>
            </v-flex>
            <v-flex xs12 sm5 mx-3>
              <v-select
                v-model="difficultvalue"
                :items="difficult"
                attach
                chips
                label="难度"
                multiple
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm2 mx-3 v-for="(t,index) in type" v-bind:key="index">
              <v-text-field
                v-model="n[index]"
                :rules="[() => !!n[index] || '请填写数量']"
                :label="t.text+'数量'"
                required
                :placeholder="String(n[index])"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm2 mx-3>
              <v-btn color="default" @click="exam(unitvalue, n, difficultvalue)">出题</v-btn>
            </v-flex>
            <v-flex xs12 sm2 mx-3>
              <v-btn color="default" @click="print()">打印</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-layout>
      <v-checkbox v-show="items||exams" v-model="showanswer" label="显示答案"></v-checkbox>
    </v-layout>
    <v-container v-for="(item,index) in items" v-bind:key="index">
      <v-flex>
        <v-card>
          <v-container>
            <div>
              <span>{{index+1}}.</span>
              <img :src="item.question||item.get('question')" :class="(item.type||item.get('type'))==4?'scale7':'scale5'" alt="question">
            </div>
            <br v-show="showanswer">
            <img :src="item.answer||item.get('answer')" :class="(item.type||item.get('type'))==4?'scale7':'scale5'" v-show="showanswer" alt="answer">
          </v-container>
        </v-card>
      </v-flex>
    </v-container>
    <v-card v-if="exams">
      <div id="print">
        <v-container v-for="(exam, ii) in exams" v-bind:key="ii">
          <v-flex>
            <strong>{{number[ii]}}、{{type[ii].text}}</strong>
          </v-flex>
          <v-flex v-for="(item, index) in exam" v-bind:key="index">
            <div>
              <span>{{index+1}}.</span>
              <img :src="item.question||item.get('question')" :class="(item.type||item.get('type'))==4?'scale7':'scale5'" alt="question">
            </div>
            <br v-show="showanswer">
            <img :src="item.answer||item.get('answer')" :class="(item.type||item.get('type'))==4?'scale7':'scale5'" v-show="showanswer" alt="answer">
          </v-flex>
        </v-container>
      </div>
    </v-card>
  </v-container>
</template>

<script>
var AV = require("leancloud-storage");
var APP_ID = "ziVcuQrAswDwlQOAv22MBrqT-9Nh9j0Va";
var APP_KEY = "HIvBh4J7tt3kbVbd9dnTJwBd";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
export default {
  data: () => ({
    unit: [2, 3, 4, 5, 7, 8],
    unitvalue: [2, 3, 4, 5, 7, 8],
    type: [
      { value: 1, text: "选择题" },
      { value: 2, text: "填空题" },
      { value: 3, text: "简答题" },
      { value: 4, text: "计算题" }
    ],
    typevalue: [1, 2, 3, 4],
    difficult: [
      { value: 1, text: "简单" },
      { value: 2, text: "普通" },
      { value: 3, text: "难" },
      { value: 4, text: "很难" }
    ],
    difficultvalue: [1, 2, 3, 4],
    items: [],
    exams: [],
    showanswer: false,
    panel: [true, false],
    n: [10, 10, 2, 4],
    number: ["一", "二", "三", "四"]
  }),
  created: function () {
    this.items = this.$storage.get("items", [])
    this.exams = this.$storage.get("exams", [])
  },
  methods: {
    search: function(unitvalue, typevalue, difficultvalue) {
      var query = new AV.Query("Bank");
      var that = this;
      that.exams = [];
      that.$storage.set("exams", []);
      query.containedIn("unit", unitvalue);
      query.containedIn("type", typevalue);
      query.containedIn("difficult", difficultvalue);
      query.addAscending("type");
      query.addAscending("difficult");
      query.addAscending("unit");
      query.find().then(
        function(results) {
          that.items = results;
          that.$storage.set("items", results);
        },
        function(error) {console.log(error);}
      );
    },
    exam: function(unitvalue, n, difficultvalue) {
      this.items = [];
      this.$storage.set("items", []);
      var query = new AV.Query("Bank");
      var that = this;
      query.containedIn("unit", unitvalue);
      query.containedIn("difficult", difficultvalue);
      query.addAscending("difficult");
      query.addAscending("unit");
      query.find().then(
        function(results) {
          var exams = [];
          for (var ii in n) {
            var typeresults = [];
            var j = 0;
            exams[ii] = [];
            for (var i in results) {
              if (results[i].get("type") == that.type[ii].value) {
                typeresults[j++] = results[i];
              }
            }
            for (i = 0; i < n[ii]; i++) {
              if(typeresults.length - i > 0){
                var ran = Math.floor(Math.random() * (typeresults.length - i));
                exams[ii].push(typeresults[ran]);
                typeresults[ran] = typeresults[typeresults.length - i - 1];
              }
            }
          }
          that.exams = exams;
          that.$storage.set("exams", exams);
        },
        function(error) {console.log(error);}
      );
    },
    print: function() {
      var printData = document.getElementById("print").innerHTML;
      document.body.innerHTML = printData;
      window.print();
      window.location.reload()
    }
  }
};
</script>

<style>
.scale5 {
  zoom: 0.5;
  vertical-align: text-top;
}
.scale7 {
  zoom: 0.7;
  vertical-align: text-top;
}
</style>
