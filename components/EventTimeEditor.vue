<template>
  <div>
    <div>
      <b>Date</b>&nbsp;<input type="text" id="datepicker">
    </div>
    <div>
      <b>Heure</b>&nbsp;
      <select v-model="time" v-on:change="save" class="timepicker">
        <option value="0">12:00 AM</option>
        <option value="30">12:30 AM</option>
        <option value="60">1:00 AM</option>
        <option value="90">1:30 AM</option>
        <option value="120">2:00 AM</option>
        <option value="150">2:30 AM</option>
        <option value="180">3:00 AM</option>
        <option value="210">3:30 AM</option>
        <option value="240">4:00 AM</option>
        <option value="270">4:30 AM</option>
        <option value="300">5:00 AM</option>
        <option value="330">5:30 AM</option>
        <option value="360">6:00 AM</option>
        <option value="390">6:30 AM</option>
        <option value="420">7:00 AM</option>
        <option value="450">7:30 AM</option>
        <option value="480">8:00 AM</option>
        <option value="510">8:30 AM</option>
        <option value="540">9:00 AM</option>
        <option value="570">9:30 AM</option>
        <option value="600">10:00 AM</option>
        <option value="630">10:30 AM</option>
        <option value="660">11:00 AM</option>
        <option value="690">11:30 AM</option>
        <option value="720">12:00 PM</option>
        <option value="750">12:30 PM</option>
        <option value="780">1:00 PM</option>
        <option value="810">1:30 PM</option>
        <option value="840">2:00 PM</option>
        <option value="870">2:30 PM</option>
        <option value="900">3:00 PM</option>
        <option value="930">3:30 PM</option>
        <option value="960">4:00 PM</option>
        <option value="990">4:30 PM</option>
        <option value="1020">5:00 PM</option>
        <option value="1050">5:30 PM</option>
        <option value="1080">6:00 PM</option>
        <option value="1110">6:30 PM</option>
        <option value="1140">7:00 PM</option>
        <option value="1170">7:30 PM</option>
        <option value="1200">8:00 PM</option>
        <option value="1230">8:30 PM</option>
        <option value="1260">9:00 PM</option>
        <option value="1290">9:30 PM</option>
        <option value="1320">10:00 PM</option>
        <option value="1350">10:30 PM</option>
        <option value="1380">11:00 PM</option>
        <option value="2110">11:30 PM</option>
      </select>
    </div>
  </div>
</template>
<script>
const Pikaday = process.browser && require('pikaday');
const moment = process.browser && require('moment');
export default {
  components: {},
  data () {
    return {
      date: null,
      time: 0,
      saveTimeout: null
    };
  },
  props: ['event'],
  methods: {
    save () {
      if (this.date) {
        const m = moment(this.date);
        if (this.time) {
          m.add(this.time, 'minutes');
        }
        this.$store.dispatch('saveCurrentEventTime', m.toDate().getTime());
      }
    },
    // ask for an auto save, but we wait some ms before saving in case another change is made
    queueChange () {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(this.save.bind(this), 300);
    }},
  mounted () {
    this.pika = new Pikaday({ // eslint-disable-line
      field: document.getElementById('datepicker'),
      firstDay: 1,
      defaultDate: new Date(2020, 12, 31),
      setDefaultDate: true,
      minDate: new Date(),
      maxDate: new Date(2020, 12, 31),
      yearRange: [2017, 2020],
      format: 'DD/MM/YYYY',
      onSelect: () => {
        this.date = this.pika.getMoment();
        this.save();
      }
    });
  },
  watch: {}
};
</script>
<style>
#datepicker {
  font-size: 20px;
  margin-bottom: 20px;

}
.timepicker {
  font-size: 20px;
}

/*!
 * Pikaday
 * Copyright © 2014 David Bushell | BSD & MIT license | http://dbushell.com/
 */

.pika-single {
  z-index: 9999;
  display: block;
  position: relative;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-bottom-color: #bbb;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}


/*
clear child float (pika-lendar), using the famous micro clearfix hack
http://nicolasgallagher.com/micro-clearfix-hack/
*/

.pika-single:before,
.pika-single:after {
  content: " ";
  display: table;
}

.pika-single:after {
  clear: both
}

.pika-single {
  *zoom: 1
}

.pika-single.is-hidden {
  display: none;
}

.pika-single.is-bound {
  position: absolute;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, .5);
}

.pika-lendar {
  float: left;
  width: 240px;
  margin: 8px;
}

.pika-title {
  position: relative;
  text-align: center;
}

.pika-label {
  display: inline-block;
  *display: inline;
  position: relative;
  z-index: 9999;
  overflow: hidden;
  margin: 0;
  padding: 5px 3px;
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
  background-color: #fff;
}

.pika-title select {
  cursor: pointer;
  position: absolute;
  z-index: 9998;
  margin: 0;
  left: 0;
  top: 5px;
  filter: alpha(opacity=0);
  opacity: 0;
}

.pika-prev,
.pika-next {
  display: block;
  cursor: pointer;
  position: relative;
  outline: none;
  border: 0;
  padding: 0;
  width: 20px;
  height: 30px;
  /* hide text using text-indent trick, using width value (it's enough) */
  text-indent: 20px;
  white-space: nowrap;
  overflow: hidden;
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 75% 75%;
  opacity: .5;
  *position: absolute;
  *top: 0;
}

.pika-prev:hover,
.pika-next:hover {
  opacity: 1;
}

.pika-prev,
.is-rtl .pika-next {
  float: left;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAUklEQVR42u3VMQoAIBADQf8Pgj+OD9hG2CtONJB2ymQkKe0HbwAP0xucDiQWARITIDEBEnMgMQ8S8+AqBIl6kKgHiXqQqAeJepBo/z38J/U0uAHlaBkBl9I4GwAAAABJRU5ErkJggg==');
  *left: 0;
}

.pika-next,
.is-rtl .pika-prev {
  float: right;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAU0lEQVR42u3VOwoAMAgE0dwfAnNjU26bYkBCFGwfiL9VVWoO+BJ4Gf3gtsEKKoFBNTCoCAYVwaAiGNQGMUHMkjGbgjk2mIONuXo0nC8XnCf1JXgArVIZAQh5TKYAAAAASUVORK5CYII=');
  *right: 0;
}

.pika-prev.is-disabled,
.pika-next.is-disabled {
  cursor: default;
  opacity: .2;
}

.pika-select {
  display: inline-block;
  *display: inline;
}

.pika-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 0;
}

.pika-table th,
.pika-table td {
  width: 14.285714285714286%;
  padding: 0;
}

.pika-table th {
  color: #999;
  font-size: 12px;
  line-height: 25px;
  font-weight: bold;
  text-align: center;
}

.pika-button {
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  outline: none;
  border: 0;
  margin: 0;
  width: 100%;
  padding: 5px;
  color: #666;
  font-size: 12px;
  line-height: 15px;
  text-align: right;
  background: #f5f5f5;
}

.pika-week {
  font-size: 11px;
  color: #999;
}

.is-today .pika-button {
  color: #33aaff;
  font-weight: bold;
}

.is-selected .pika-button,
.has-event .pika-button {
  color: #fff;
  font-weight: bold;
  background: #33aaff;
  box-shadow: inset 0 1px 3px #178fe5;
  border-radius: 3px;
}

.has-event .pika-button {
  background: #005da9;
  box-shadow: inset 0 1px 3px #0076c9;
}

.is-disabled .pika-button,
.is-inrange .pika-button {
  background: #D5E9F7;
}

.is-startrange .pika-button {
  color: #fff;
  background: #6CB31D;
  box-shadow: none;
  border-radius: 3px;
}

.is-endrange .pika-button {
  color: #fff;
  background: #33aaff;
  box-shadow: none;
  border-radius: 3px;
}

.is-disabled .pika-button,
.is-outside-current-month .pika-button {
  pointer-events: none;
  cursor: default;
  color: #999;
  opacity: .3;
}

.pika-button:hover,
.pika-row.pick-whole-week:hover .pika-button {
  color: #fff;
  background: #ff8000;
  box-shadow: none;
  border-radius: 3px;
}


/* styling for abbr */

.pika-table abbr {
  border-bottom: none;
  cursor: help;
}
</style>

