// Enough Handson - RxJS
// Part 5

console.log('----------RxJS: Managing multiple streams and avoid un-subscribing workshop-------------');

console.log('*** Multiple Streams - Naive Example with no optimization ***');

var myGenericComponent = {

  updateData: function(data) {
    console.log('Naive non-optimized example: Value ', data);
  },

  onMount: function() {
    this.dataSub = this.getData()
      .subscribe(data => this.updateData(data));

    const cancelBtn = document.querySelector('#btnCancel');
    const rangeSelector = document.querySelector('#inRange');

    this.cancelSub = Rx.Observable.fromEvent(cancelBtn, 'click')
                    .subscribe(() => {
                        this.dataSub.unsubscribe();
                      });

    this.rangeSub = Rx.Observable.fromEvent(rangeSelector, 'change')
                    .map(e => e.target.value)
                        .subscribe((value) => {
                          console.log(value);
                          if (+value > 75) {
                            console.log('Unsubscribing naive non-optimized because value > 75');
                            //this.dataSub.unsubscribe();
                            this.onUnmountRange(); // Alternate example, show line above
                          }
                        });
  },

  onUnmount: function() {
    this.dataSub.unsubscribe();
    this.cancelSub.unsubscribe();
  },

  onUnmountRange: function () {
    this.rangeSub.unsubscribe();
  },

  getData(){
    return  Rx.Observable.interval(1000);
  }
};

myGenericComponent.onMount();

// Also call myGenericComponent.onUnmount() for learning

console.log('*** Multiple Streams - Naive Example with optimization ***');

var myOptimizedGenericComponent = {

  updateData: function(data) {
    console.log('Naive optimized example: Value ', data);
  },

  onMount: function() {

    // DOM References
    const cancelBtn = document.querySelector('#btnCancelOptimized');
    const rangeSelector = document.querySelector('#inRangeOptimized');

    // Source Streams
    let data$ = this.getData();
    let cancel$ = Rx.Observable.fromEvent(cancelBtn, 'click');
    let range$ = Rx.Observable.fromEvent(rangeSelector, 'change').map(e => e.target.value);

    // Merge Stream
    const stop$ = Rx.Observable.merge(cancel$, range$.filter(x => x> 75));

    // Subscription
    this.subscription = data$.takeUntil(stop$).subscribe( data => this.updateData(data));

  },

  onUnmount: function() {
    this.subscription.unsubscribe();
  },

  getData(){
    return  Rx.Observable.interval(1000);
  }
};

myOptimizedGenericComponent.onMount();