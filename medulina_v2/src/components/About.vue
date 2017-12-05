<template>
  <div class="container-fluid" id="main" v-cloak>
    <section class="jumbotron text-center">
      <div class="container">
        <a class="navbar-brand" href="/">
          <object data="../assets/logo.svg" type="image/svg+xml"></object>
          <!--<svg class="navbar-brand" src="../assets/logo.svg" width="100px"></svg>-->
        </a>
        <h1 class="jumbotron-heading">About Medulina</h1>
        <p class="lead text-muted"> The crowdsourcing game to segment brains</p>

      </div>
    </section>

    <div class="">
    <div class="container">
      <div class="row rowb">


        <h4>Why Medulina?</h4>
        <p>
          Scientists have learned a lot about the brain by measuring it from non-invasive imaging, like MRI.
          But as we collect larger datasets, our measurements become less accurate.
          Current computer algorithms are able to make measurements quickly, but are not very accurate.
          Expert neuroanatomists are accurate, but it takes them a long time.
          The goal of the Medulina project is to train citizen scientists in neuroanatomy, and combine their measurements with
          computer algorithms to get the most accurate measurements of the brain in a short amount of time.

        </p>
        <p>Medulina is an open source game to crowdsource brain image segmentation.
          Its still in beta, but if you want to try it out, you just need a <a href="https://github.com">GitHub </a> account.
          Currently, you can try to identify <a href="http://tumor.medulina.com"> meningiomas </a> (a type of brain tumor),
          <a href="http://stroke.medulina.com"> stroke lesions </a>, and the <a href="http://dg.medulina.com"> dentate gyrus </a>,
          a structure in the brain that is important for forming new memories.


        </p>
      </div>

      <div class="row rowb">
        <h4> The Team</h4>

        <p>
          Medulina was started by <a href="http://akeshavan.github.com">Anisha Keshavan</a> while procrastinating on writing her PhD disseration.

          <a href="">Dylan Nielson</a> and <a href=""> Adam Thomas </a> became collaborators when they all met at the <a href="">2017 OHBM Hackathon</a>.
        </p>
      </div>

      <div class="row rowb">

        <h4>What hardware do I need to play?</h4>

        <p>
          Medulina works on a computer, tablet and even a cell phone (but you should only play if you have a large screen, and you are connected to wifi/have unlimited data).
        </p>
      </div>
      <div class="row rowb">
        <h4>Can I crowdsource my data on Medulina?</h4>

        <p>
          We are actively developing Medulina, so it is not "live" yet.
          If you are interested in using Medulina for your data, please post on our
          <a href="https://github.com/medulina/medulina.github.io">Github Issues Page </a> or

           email <u>anishakeshavan at gmail dot com</u> .

        </p>
      </div>

      <div class="row rowb">
        <h4> I found a bug! What do I do? </h4>
        <p>
          Please post on our <a href="https://github.com/medulina/medulina.github.io">Github Issues Page </a>!
        </p>
      </div>


      <div class="row rowb">
        <h4> Want to join the team? </h4>

        <p>
          Join us on <a href="https://github.com/medulina/medulina.github.io">GitHub</a> and
          on the #medulina <a href="https://brainhack.slack.com">brainhack slack </a> channel!
        </p>
      </div>



      <div class="row rowb">
        <h4> What does Medulina mean? </h4>

          It means "the brain"  in <a href="https://translate.google.com/?sl=kn&q=medulina#kn/en/medulina"> Kannada </a>, a South Indian language.

      </div>
    </div>
  </div>
</div>
</template>

<style>
</style>

<script>

export default {
  name: 'About',
  data() {
    return {
      // stuff
    };
  },
};
</script>
