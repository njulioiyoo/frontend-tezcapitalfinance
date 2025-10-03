<script setup lang="ts"></script>

<template>
  <div>
    <Jumbotron label="Jadi Bagian Dari TEZ Capital" img="/img/dummy1.jpg" />
    <div class="relative">
      <div class="xl:px-15 px-3 py-8 xl:py-12 relative">
        <NuxtLink
          to="/news"
          class="flex items-center gap-1 text-base text-red-100 mb-6 xl:hidden"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          Back
        </NuxtLink>
        <div class="mb-6 pb-6 border-b border-b-gray-200">
          <h1 class="xl:text-5xl text-2xl text-black-100 text-center font-bold">
            Procurement Supervisor
          </h1>
        </div>
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <h6 class="text-xl xl:text-4xl font-bold">About the Role</h6>
            <p class="text-base xl:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              tristique consequat libero, sed commodo massa maximus accumsan.
              Nullam dapibus enim vel felis maximus pulvinar. Fusce vulputate a
              sem at fringilla. Morbi mauris lorem, commodo auctor tincidunt a,
              interdum ac nunc.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h6 class="text-xl xl:text-4xl font-bold">What You Will Do</h6>
            <ul class="list-disc list-inside text-base xl:text-xl">
              <li>
                Plan and deliver internal audits of a determined business area
                or department
              </li>
              <li>
                Support the preparation of the audit plan and perform end-to-end
                audit fieldwork.
              </li>
              <li>
                Assess risk, adequacy of controls, perform root cause analysis,
                determine severity of deficiencies, communicate recommendations,
                and validate remediation.
              </li>
              <li>
                Liaise and collaborate with other business leaders and
                governance teams in ERM, Compliance, GRC, Tech Risk, and
                Investigation on ad-hoc projects.
              </li>
              <li>
                Advise management on audit issues and provide practical
                remediation recommendation, and monitor audit issue status and
                closure.
              </li>
              <li>
                Present and discuss audit projects and results with senior
                management.
              </li>
              <li>
                Provide mentorship and training to internal audit team members.
              </li>
              <li>Support other team members on various tasks as necessary.</li>
            </ul>
          </div>
          <div class="flex flex-col gap-2">
            <h6 class="text-xl xl:text-4xl font-bold">What You Will Need</h6>
            <ul class="list-disc list-inside text-base xl:text-xl">
              <li>
                Bachelor's degree (minimum) with at least 12 years of internal
                audit experience, with at least 5 years at a public accounting
                firm.
              </li>
              <li>Experienced in managing a Team</li>
              <li>
                Previous experience in the banking industry, solid banking
                industry knowledge and/or experience in internal
                audit/consulting firms is preferred.
              </li>
              <li>
                Relevant professional certifications: CIA, CISA, CPA, or
                equivalent.
              </li>
              <li>
                Internal audit expertise (end-to-end). experienced in auditing
                basic business cycles (SOX, ERM, QAR).
              </li>
              <li>
                Strong understanding of audit methodology, control testing, root
                cause analysis, audit project management, and team supervision.
              </li>
              <li>
                Detail-oriented, hands-on in project execution, with strong
                communication skills, strong stakeholder management at senior
                levels
              </li>
              <li>Fluency in English (oral and written).</li>
            </ul>
          </div>
          <div class="flex flex-col gap-2">
            <h6 class="text-xl xl:text-4xl font-bold">About the Team</h6>
            <p class="text-base xl:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              tristique consequat libero, sed commodo massa maximus accumsan.
              Nullam dapibus enim vel felis maximus pulvinar. Fusce vulputate a
              sem at fringilla. Morbi mauris lorem, commodo auctor tincidunt a,
              interdum ac nunc.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h6 class="text-xl xl:text-4xl font-bold">About TEZ Capital</h6>
            <p class="text-base xl:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              tristique consequat libero, sed commodo massa maximus accumsan.
              Nullam dapibus enim vel felis maximus pulvinar. Fusce vulputate a
              sem at fringilla. Morbi mauris lorem, commodo auctor tincidunt a,
              interdum ac nunc.
            </p>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-t-gray-200">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div class="flex flex-col">
              <p class="text-divider text-sm lg:text-xl">Departemen</p>
              <p class="text-black-50 text-base lg:text-2xl font-bold">
                Finance
              </p>
            </div>
            <div class="flex flex-col">
              <p class="text-divider text-sm lg:text-xl">Lokasi</p>
              <p class="text-black-50 text-base lg:text-2xl font-bold">
                Jakarta
              </p>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="py-1 px-6 rounded-full bg-red-100 hover:bg-red-50 transition-all duration-300 font-bold text-xl text-white hover:text-red-100 flex items-center justify-center cursor-pointer"
              >Lamar Sekarang</a
            >
          </div>
        </div>
      </div>
      <NuxtLink to="/news" class="hidden xl:block">
        <Icon name="mdi:chevron-left" class="size-8 absolute top-12 left-0" />
      </NuxtLink>
    </div>
  </div>
</template>