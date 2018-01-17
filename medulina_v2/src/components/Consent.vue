<template>
  <!-- Informed Consent -->
  <div id="consent">
    <h4 class="centered">UNIVERSITY OF WASHINGTON</h4>
    <h4 class="centered">CONSENT FORM</h4>

    <h5 class="centered" >Crowdsourcing Image Segmentation</h5>
    <br>
    <h5>RESEARCHERS:</h5>
    <p>
    Anisha Keshavan<br>
    University of Washington eScience Institute and Institute for Neuroengineering<br>
    keshavan@uw.edu<br>
    </p>
    <p>
    Jason Yeatman<br>
    University of Washington Institute for Neuroengineering<br>
    jdyeatman@uw.edu<br>
    </p>
    <p>
    Ariel Rokem<br>
    University of Washington eScience Institute<br>
    arokem@uw.edu<br>
    </p>

    <h5>RESEARCHER’S STATEMENT:</h5>
    <p>
    We are asking you to be in a research study.  The purpose of this consent form is to give you the information you will need to help you decide whether to be in the study or not.  Please read the form carefully.  You may ask questions about the purpose of the research, what we would ask you to do, the possible risks and benefits, your rights as a volunteer, and anything else about the research or this form that is not clear. Please email keshavan@uw.edu any questions.  When we have answered all your questions, you can decide if you want to be in the study or not.  This process is called “informed consent.”
    </p>

    <h5>PURPOSE OF THE STUDY</h5>
    <p>
    Image segmentation is a method to take measurements from images, but computer algorithms often make mistakes. The purpose of this study is to train better computer algorithms to segment images, and also correct any errors the computer makes.  In particular, we aim to train you to accurately measure images through an image segmentation game. We aim to 1) collect image segmentation data from you, 2) track how quickly and accurately you learn to segment images, and 3) combine segmentations from many users into the most accurate segmentation. This information will be used to train new computer algorithms.
    </p>

    <h5>STUDY PROCEDURES</h5>
    <p>
    The study starts with instructions on how to segment images for a particular task. We will show images with arrows pointing to the structure in the images we want you to segment, or “paint”. The different image editing features of the game will be presented (such as: paint, fill, erase, change brightness/contrast).
    </p>
    <p>
    After reading the instructions, you will be asked to log in. You may use an existing social media login (e.g. Twitter, Facebook, Google, etc.), and you will be asked to create a username. You may also choose to include your social media avatar to display alongside your username in the public leaderboard.
    </p>
    <p>
    Each task consists of 1 image that needs to be segmented. When complete, you will click the “submit” button. Upon submission, the image might be scored against a “ground truth” image from a researcher, and you will receive feedback on how well you did. When you are ready, you can click “Next” to segment a new image. If your segmentations are deemed accurate enough by the computer, you will be presented with new images to segment, and you will not receive feedback on your segmentation. Instead, you will receive points, that will increase your positioning on a public leaderboard.
    </p>
    <p>
    You may use any device with a web browser (computer, tablet, or phone). We will record all settings you use on the application, the image coordinates you mark, your screen resolution, and your username. This data will be made publically available to researchers.
    </p>
    <p>
    The whole study can be finished online, and you may complete however many tasks you wish. Each task can take anywhere from 30 seconds to 5 minutes. You may stop playing at any time.
    </p>

    <h5>RISKS, STRESS, OR DISCOMFORT</h5>
    <p>
    Some people feel that providing information for research or having the research session recorded is an invasion of privacy. If you wish to remain anonymous, we recommend creating an anonymous username that does not include any identifiers relating to you.
    </p>

    <h5>BENEFITS OF THE STUDY</h5>
    <p>
    This study will help us to take accurate measurements of images. These measurements will be used for scientific research.
    </p>

    <h5>CONFIDENTIALITY OF RESEARCH INFORMATION</h5>
    <p>
    Your social media login information (such as email address) will remain confidential.
    Government or university staff sometimes review studies such as this one to make sure they are being done safely and legally.  If a review of this study takes place, your records may be examined.  The reviewers will protect your privacy.  The study records will not be used to put you at legal risk of harm.
    </p>

    <h5>OTHER INFORMATION</h5>
    <p>
    You may refuse to participate and you are free to withdraw from this study at any time without penalty or loss of benefits to which you are otherwise entitled. Your compensation will be based on the number of images segmented at a minimum rate approximately equal to $8/hour. Depending on your speed and accuracy, your compensation may be higher. Information about you is confidential. If the results of this study are published or presented, we will not use your name.
    </p>


    <h5>RESEARCH-RELATED INJURY</h5>
    <p>
    If you think you have been harmed from being in this research, contact Anisha Keshavan at keshavan@uw.edu.
    * Please note that we cannot ensure the confidentiality of information sent via e-mail.
    </p>


    <h5>SUBJECT’S STATEMENT</h5>
    <p>
    This study has been explained to me.  I am age 18 or older, and I volunteer to take part in this research.  I have had a chance to ask questions.  If I have questions later about the research, or if I have been harmed by participating in this study, I can contact one of the researchers listed on the first page of this consent form.  If I have questions about my rights as a research subject, I can call the Human Subjects Division at (206) 543-0098 or email hsdinfo@uw.edu.  I will receive a copy of this consent form via email.
    </p>

    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" id="inlineCheckbox1" v-model="age"> I am 18 years or older
      </label>
    </div>

    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" id="inlineCheckbox2" v-model="consent"> I consent to this study
      </label>
    </div>

    <div class="form-check form-check-inline disabled">
      <button class="btn btn-primary colorBold" v-bind:disabled="!(age && consent)" v-on:click="afterConsent">Submit</button>
    </div>

  </div>






</template>
<style>

#consent {
  padding: 20px;
}

</style>

<script>
import axios from 'axios';
import store from 'store';
import config from '../config';

export default {
  name: 'Consent',
  data() {
    return {
      age: false,
      consent: false,
    };
  },
  methods: {
    afterConsent() {
      console.log('this.login', this.login);
      const params = {
        user_id: this.login.id,
        token: this.login.token.token,
        has_consented: this.consent,
      };
      console.log('params are', params);
      const url = `${config.consent_url}?token=${this.login.token.token}&user_id=${this.login.id}&has_consented=${this.consent}`;
      axios.get(url).then((resp) => {
        console.log('afterconsent resp', resp);
        this.$emit('has_consented', resp.data);
        this.$router.push({ path: `/play/${this.task}` });
      }).catch((e) => {
        console.log('afterConsent err', e);
      });
    },
  },
  props: ['login', 'task'],
};
</script>
