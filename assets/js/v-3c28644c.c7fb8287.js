"use strict";(self.webpackChunkvp=self.webpackChunkvp||[]).push([[40559],{91088:(e,t,o)=>{o.r(t),o.d(t,{data:()=>a});const a={key:"v-3c28644c",path:"/guide/usage/touchlink.html",title:"Touchlink",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:2,title:"Scan",slug:"scan",children:[]},{level:2,title:"Identify",slug:"identify",children:[]},{level:2,title:"Factory reset device",slug:"factory-reset-device",children:[]}],filePathRelative:"guide/usage/touchlink.md",git:{updatedTime:1636137985e3}}},20600:(e,t,o)=>{o.r(t),o.d(t,{default:()=>l});var a=o(66252);const i=(0,a.uE)('<h1 id="touchlink" tabindex="-1"><a class="header-anchor" href="#touchlink" aria-hidden="true">#</a> Touchlink</h1><p><strong>Important:</strong> Touchlink <strong>only</strong> works for adapters based on a Texas Instruments chip (chips starting with CC, e.g. CC2652).</p><p>Touchlink is a feature of Zigbee which allows devices physically close to each other to communicate with each other <strong>without</strong> being in the same network.</p><p>Note that not all Zigbee devices support Touchlink, but most bulbs of common brands like Philips and IKEA support this.</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>All commands below can also be executed via the frontend <em>Touchlink</em> tab.</p></div><h2 id="scan" tabindex="-1"><a class="header-anchor" href="#scan" aria-hidden="true">#</a> Scan</h2><p>This allows to scan for Touchlink enabled devices. The outcome of this scan can be used later to determine what device to factory reset. To scan send a MQTT message to <code>zigbee2mqtt/bridge/request/touchlink/scan</code> with an empty payload. The response will be send to <code>zigbee2mqtt/bridge/response/touchlink/scan</code>, example payload: <code>{&quot;data&quot;:{&quot;found&quot;:[{&quot;ieee_address&quot;: &#39;0x12345678&#39;, &quot;channel&quot;: 12}, {&quot;ieee_address&quot;: &#39;0x12654321&#39;, &quot;channel&quot;: 24}]},&quot;status&quot;:&quot;ok&quot;}</code>.</p><h2 id="identify" tabindex="-1"><a class="header-anchor" href="#identify" aria-hidden="true">#</a> Identify</h2><p>This allows to identify (e.g. bulb blinking) a device via Touchlink. To identify send a MQTT message to <code>zigbee2mqtt/bridge/request/touchlink/identify</code> with payload e.g. <code>{&quot;ieee_address&quot;: &#39;0x12345678&#39;, &quot;channel&quot;: 12}</code> (use scan from above to determine <code>ieee_address</code> and <code>channel</code>).</p><h2 id="factory-reset-device" tabindex="-1"><a class="header-anchor" href="#factory-reset-device" aria-hidden="true">#</a> Factory reset device</h2>',10),n=(0,a.Uk)("Zigbee2MQTT allows to factory reset devices through Touchlink. This is especially handy for e.g. Philips Hue bulbs as they cannot be factory reset by turning them on/off 5 times. Demo: "),s={href:"https://www.youtube.com/watch?v=kcRj77YGyKk",target:"_blank",rel:"noopener noreferrer"},c=(0,a.Uk)("video"),r=(0,a.uE)("<p>To factory reset a device through Touchlink bring the device close (&lt; 10 cm) to your coordinator (e.g. CC2531 adapter). After this send a MQTT message to <code>zigbee2mqtt/bridge/request/touchlink/factory_reset</code> with an empty payload.</p><p>Zigbee2MQTT will now start scanning, this can take up to 1 minute and during this scan <strong>your network cannot be used</strong>. After some time the device will identify itself (e.g. a bulb will start to blink).</p><p>Now that your device has been factory reset, it will automatically join Zigbee2MQTT (make sure that joining is enabled through <code>permit_join: true</code>). If it doesn&#39;t, try powering the bulb off and on 1 time.</p><p>In case you want to factory reset a specific device (which can be found through a scan, see above) request the factory reset with the following payload: <code>{&quot;ieee_address&quot;: &quot;0x12345678&quot;, &quot;channel&quot;: 12}</code>.</p>",4),d={},l=(0,o(83744).Z)(d,[["render",function(e,t){const o=(0,a.up)("OutboundLink");return(0,a.wg)(),(0,a.iD)(a.HY,null,[i,(0,a._)("p",null,[n,(0,a._)("a",s,[c,(0,a.Wm)(o)])]),r],64)}]])},83744:(e,t)=>{t.Z=(e,t)=>{for(const[o,a]of t)e[o]=a;return e}}}]);