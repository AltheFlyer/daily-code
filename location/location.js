let map = document.getElementById("map");
let geo = navigator.geolocation;

geo.getCurrentPosition(function(pos) {
    console.log("Location found");
    let mapStringStart = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1437.3433716833927"
    let mapStringEnd = "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca!4v1597256308314!5m2!1sen!2sca";
    
    let mapVals = "!2d" + pos.coords.longitude + "!3d" + pos.coords.latitude;

    console.log(pos);
    console.log(mapStringStart + mapVals + mapStringEnd);
    map.setAttribute("src", mapStringStart + mapVals + mapStringEnd);
});