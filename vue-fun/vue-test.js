const App = {
    data() {
        return {
            message: "Hello world!",
            seen: false,
            topics: [
                {text: "Kinematics", subtopics: [
                    "Displacement", "Velocity", "Acceleration"
                ]},
                {text: "Dynamics", subtopics: [
                    "Forces"
                ]},
                {text: "Energy", subtopics: [
                    "Potential Energy"
                ]}
            ]
        }
    },
    provide() {
        return {
            seen: this.seen
        }
    },
    methods: {
        toggleVisibility() {
            this.seen = !this.seen;
        }
    }
}

const app = Vue.createApp(App);

app.component('v-on', {
    inject: ["seen"],
    template: `<span v-bind:seen="this.seen">{{seen}}</span>`,
    created() {
        console.log(this.seen)
    }
});

app.component('topic', {
    props: {
        topic: {
            type: Object,
            required: true
        }
    },
    template: `<li>{{topic.text}}
                    <ul class="subtopic-list">
                        <li v-for="subtopic in topic.subtopics">{{subtopic}}</li>
                    </ul>
                </li>`
});

app.mount('#app');