<script lang="ts">
  import ItmsAsstbody from "../components/ItmsAsstbody.svelte";
</script>

<div class="container-sm">
  <div class="flex flex-col">
    <div class=" w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Job</th>
            <th>Company</th>
            <th>Inform</th>
            <!--  <th>Bespeak</th> -->
            <th>
              <div class="btn-group ">
                <button class="btn">
                  <!-- The button to open modal -->
                  <a href="#my-modal-2">Create Resume</a>
                </button>
                <div class="dropdown">
                  <button tabindex="0" class="btn">
                    <!-- hamburger icon -->
                    <svg
                      class="swap-off fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 512 512"
                      ><path
                        d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
                      /></svg
                    >
                  </button>
                  <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">              
                    <li><a>Delete All</a></li>
                    <li><a>Save</a></li>
                  </ul>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <ItmsAsstbody />
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Put this part before </body> tag -->
<div class="modal" id="my-modal-2">
  <div class="modal-box">
    <h3 class="font-bold text-2xl">Create Person</h3>
    <div class="flex flex-col gap-2 mt-4">
      <input
        type="text"
        placeholder="Name"
        class="input input-bordered w-full"
      />
    </div>
    <div class="modal-action">
      <button class="btn btn-primary">Create</button>
      <a href="#" class="btn">Yay!</a>
    </div>
  </div>
</div>
