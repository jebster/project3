var NPCObj = function(x,y,id, category, university, gender) {
    this.pos_x = 0;
    this.pos_y = 0;

    this.category = category;
    this.gender = gender;
    this.university = university;

    this.abstractionModifier;


    this.daveReputation = null;

    //distribution curve for preferenceType AND
    // primaryType

    // 0 - 0.3: Nerd
    // 0.3 - 0.7: Talent
    // 0.7-1.0: Hunk


    if(this.gender == "male"){

        if (this.category === "engine") {

            this.primaryTypeIndex = 0.3; //want a super nerd
            this.primaryType = 'nerd';
            this.primaryTypeScore = 10;


        }
        if (this.category === "arts") {

            this.primaryType
          
          
        }
        if (this.category === "law") {
          
        }
    }

    if(this.gender == "female"){

        this.primaryPreferenceIndex = 0.5;
        this.primaryPreference = 'talent';

        // each interaction, girl goes into guy this.primaryTypeScore, and updates primaryPreferenceScore
        this.primaryPreference_best = 0.2;

        this.laidWithDave = true;

    }

    /*
    When Two NPCs meet:
    1. Update this.PrimaryPreferenceScore to the highest one
    2. Have an impact on daveReputation


    */
    

    this.draw = function() {
    // body...
    }

}

