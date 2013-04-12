var NPCObj = function(x,y,id, category, university, gender) {
    this.pos_x = 0;
    this.pos_y = 0;

    this.category = category;
    this.gender = gender;
    this.university = university;

    this.abstractionModifier;

    if(this.gender == "male"){

        if (this.category === "engine") {
            this.fitness = 0.3;
            this.studies = 0.6;
            this.talent = 0.4;
        }
        if (this.category === "arts") {
            this.fitness = 0.6;
            this.studies = 0.3;
            this.talent = 0.5;
        }
        if (this.category === "law") {
            this.fitness = 0.3;
            this.studies = 0.6;
            this.talent = 0.4;
        }
    }

    if(this.gender == "female"){
        this.preferenceType = "hunk";
        this.bestGuyScore;
    }
    

    this.draw = function() {
    // body...
    }

}

