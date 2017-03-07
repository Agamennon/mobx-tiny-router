//import {Router} from 'director/build/director';
import {autorun,extendObservable,observable,action,toJS} from 'mobx';
import {fromResource} from 'mobx-utils';
import queryString from 'query-string'


const startRouter = (store,routes,url) => {



   console.log(store);

    function cloneLocation (){
        const l = window.location;
        return Object.assign({}, {
            hash: l.hash,
            host: l.host,
            hostname: l.hostname,
            href: l.href,
            origin: l.origin,
            pathname: l.pathname,
            port: l.port,
            protocol: l.protocol,
            search: l.search,
            query:queryString.parse(l.search)
        });

    }

    const location = observable( cloneLocation ());
   // store.router.location = location;
    window.addEventListener('popstate', action('popstateHandler', (ev) => {
        console.log('location changed');
         store.router.currentPath = Math.random();
         extendObservable(location, cloneLocation())

    }));




    autorun(() => {
        console.log(toJS(location));
     //   console.log(store.router.location.pathname);

        const {currentPath} = store.router;
        console.log(currentPath);
        if (currentPath !== location.pathname) {

           //  window.history.pushState(null, null, currentPath)
        }
    });

};

export default startRouter;




/* let  currentSubscription;
 let locationObs = fromResource(
 (sink) => {
 // sink the current state
 //        const {filter, filteredTodos,clearComplete, todos} = this.props.store;





 sink(cloneLocations());
 // subscribe to the record, invoke the sink callback whenever new data arrives
 currentSubscription = window.addEventListener('popstate',() => {

 sink(cloneLocations())
 })
 },
 () => {
 // the user observable is not in use at the moment, unsubscribe (for now)
 location.unsubscribe(currentSubscription)
 }
 );


 autorun(() => {
 // printed everytime the database updates its records
 console.log(locationObs.current())
 })

 */


/*  autorun(() => {
 const {currentPath} = store.router;
 if (currentPath !== window.location.pathname) {
 window.history.pushState(null, null, currentPath)
 }
 });*/