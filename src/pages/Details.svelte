<script lang="ts">
</script>

<div class="container-sm">
    <div class="flex flex-col">
        <div class="grid gap-4 grid-cols-5">
            <!-- Card 1 -->
            <div class="card w-full bg-base-100 shadow-xl">
                <figure>
                    <img
                        src="https://api.lorem.space/image/shoes?w=400&h=225"
                        alt="Shoes"
                    />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">Name</h2>
                    <p>If a dog chews shoes whose shoes does he choose?</p>
                    <div class="card-actions justify-end">
                        <!-- The button to open modal -->
                        <label for="my-modal-4" class="btn modal-button"
                            >open modal</label
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
        <div class="flex-row">
            <div>
                <h1>
                    Temur <br />
                    +99851454634
                </h1>
                <button class="btn"><a href="#">Phone</a></button>
            </div>
            <div>
                <h2>
                    Send a Message <br />
                    temurpulatov.888@gmail.com
                </h2>
                <button class="btn"
                    ><a type="email" href="temurpulatov.888 ">Message</a
                    ></button
                >
            </div>
        </div>
    </label>
</label>
