let title = new Vue({
    el: "#title",
    data: {
        title: "Hello Vue"
    }
});


let count = 0;

Vue.component('topic', {
    props: ['topic'],
    template: '<li><h3>{{topic.title}}</h3>{{topic.text}}<ul><li v-for="subtopic in topic.subtopics">{{subtopic}}</li></ul></li>'
});

let app = new Vue({
    el: "#app",
    data: {
        count: 0,
        title: "This should display when you hover " + 0,
        message: "Welcome!",
        vStyle: {
            color: "red"
        },

        topics: [
            {title: "Kinematics", text: "The ways objects move.", subtopics: [
                "Displacement",
                "Velocity",
                "Acceleration",
                "Freefall",
                "Circular Motion",
                "Relative Velocity",
                "Collisions"
            ]},
            {title: "Dynamics", text: "What causes objects to move.", subtopics: [
                "Forces", 
                "Newton's Laws",
                "Axis Systems",
                "Ficticious Forces"
            ]},
            {title: "Energy", text: "The relation between forces and velocity", subtopics: [
                "Work",
                "Kinetic Energy",
                "Potential Energy",
                "Conservative Forces"
            ]}
        ]
    },
    methods: {
        incrementCount: function() {
            this.count ++;
            this.title = "This should display when you hover " + this.count
        }
    }
});