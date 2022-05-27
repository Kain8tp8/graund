<script lang="ts">
    import { Router, Link, Route } from "svelte-navigator";
    import Assistabel from "./pages/assistabel.svelte";
    import About from "./pages/about.svelte";
    import Details from "./pages/Details.svelte";
    import Contact from "./pages/Contact.svelte";
</script>

<Router>
    <main class="container mx-auto">
    
        <div class="navbar h-24 bg-base-100">
            <div class="navbar-start">
                <h1 class="text-ghost normal-case text-5xl">daisyUI</h1>
            </div>
            <div class="navbar-center">

                <div class="form-control">
                    <div class="input-group">
                    <input type="text" placeholder="Search…" class="input input-bordered" />
                    <button class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    </div>
                </div>                       

            </div>
            <div class="navbar-end">

               
                <div class="flex justify-around"> 

                    <ul class="menu menu-horizontal flex justify-between ">
                    <!-- Navbar menu content here -->
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/assistabel">Assistant</Link></li>
                    <li><Link to="/details">Details</Link></li>
                    <li><Link to="/contact">Contact</Link></li>      
                    <li><Link to="/" class="singbtn rounded-lg text-white">Sing-in</Link></li>
                    </ul> 

                </div>
            </div>
        </div>
        
        <Route path="/assistabel" component={Assistabel} />
        <Route path="/about" component={About} />
        <Route path="/details" component={Details} />
        <Route path="/contact" component={Contact} />

    </main>
</Router>