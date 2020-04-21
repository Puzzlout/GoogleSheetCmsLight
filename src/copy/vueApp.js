var app = new Vue({
  el: "#app",
  data: {
    sheetUrl:
      "https://docs.google.com/spreadsheets/d/1DRxADFiW4fjf_3vApWt2m4Nv3K0iEljvV2l4TJeaBNk/pubhtml",
    content: {},
    loading: true,
    options: {
      enableLog: true,
      useGoogleForms: true,
      showTos: false,
      updateHead: true,
    },
  },
  methods: {
    showtos: function (event) {},
    hidetos: function (event) {},
    loadSheetData: function () {
      var gSheetReader = new GoogleSheetReader({
        sheetUrl: this.sheetUrl,
        enableLog: this.options.enableLog,
      });
      var runPromise = gSheetReader.GetData();
      selfVue = this;
      runPromise
        .then(function (tabletop) {
          const fetchedContent = gSheetReader.TransformData(tabletop);
          new DomHeadUpdater({
            enableFeature: selfVue.options.updateHead,
            enableLog: selfVue.options.enableLog,
            data: fetchedContent.MetaData,
          }).Run();
          selfVue.content = fetchedContent;
          if (selfVue.options.enableLog) console.log(selfVue.content);

          selfVue.loading = false;
        })
        .catch(function (promise_err) {
          console.log(promise_err);
        });
    },
  },
  created: function () {
    this.loadSheetData();
    if (!this.content) throw new Error("No data loaded");
  },
});
