import './_materialize.scss'
import {MDCDrawer} from "@material/drawer";

const drawerEl = document.querySelector('.mdc-drawer')
const navigationButtonEl = document.getElementsByClassName('mdc-top-app-bar__navigation-icon')[0]


let drawer = undefined

navigationButtonEl.addEventListener("click", () => {
    if (useModal) drawer.open = true
})

let linkToVisit = null
const listEl = document.querySelector('.mdc-drawer .mdc-list');
listEl.addEventListener('click', (event) => {
    if (!useModal) return

    drawer.open = false;
    event.preventDefault()
    linkToVisit = event.target.href
});

document.body.addEventListener('MDCDrawer:closed', () => {
    if (linkToVisit) window.location.href = linkToVisit
});

let useModal = false
const layoutNav = function() {
    const shouldUseModal =  window.innerWidth < 800
    if (shouldUseModal === useModal) return

    drawerEl.classList.toggle('mdc-drawer--modal', shouldUseModal)

    if (useModal && drawer && drawer.open) {
        console.log('should close drawer')
        drawer.open = false
    }

    if (shouldUseModal && !drawer)  drawer = MDCDrawer.attachTo(drawerEl)

    useModal = shouldUseModal
}


window.addEventListener( 'resize', layoutNav, false );
layoutNav()
