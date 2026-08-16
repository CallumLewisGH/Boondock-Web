<template>
  <!-- Hero Section -->
  <header class="relative pt-32 pb-16 px-4 overflow-hidden"
          :style="{ backgroundColor: 'var(--header-bg)' }">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-[10%] left-1/4 w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-orange)' }"></div>
      <div class="absolute -bottom-[10%] right-1/4 w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-amber)' }"></div>
    </div>

    <div class="relative z-10 text-center max-w-4xl mx-auto">
      <span class="inline-block py-1 px-3 rounded-full text-sm font-bold mb-6 tracking-wide uppercase border"
            :style="{
              backgroundColor: 'var(--badge-bg)',
              borderColor: 'var(--badge-border)',
              color: 'var(--accent)'
            }">
        Legal
      </span>
      <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          :style="{ color: 'var(--header-text)' }">
        Privacy <span :style="{ color: 'var(--accent)' }">Policy</span>
      </h1>
      <p class="text-base" :style="{ color: 'var(--header-muted)' }">
        Last updated 16 August 2026
      </p>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8" :style="{ backgroundColor: 'var(--surface)' }">
    <div class="max-w-3xl mx-auto space-y-12">

      <section>
        <p class="text-lg leading-relaxed" :style="{ color: 'var(--muted)' }">
          Boondock is a small, independently run app for finding and sharing wild-camping
          spots. This page explains, in plain language, what information we collect, why,
          and how you can control it. If anything here is unclear, email
          <a href="mailto:callumlewis@boondock.uk" class="underline" :style="{ color: 'var(--accent)' }">callumlewis@boondock.uk</a>
          and we'll help directly.
        </p>
      </section>

      <section v-for="block in sections" :key="block.title">
        <h2 class="text-2xl font-bold mb-4" :style="{ color: 'var(--text-color)' }">
          {{ block.title }}
        </h2>
        <div class="h-1 w-12 rounded mb-6" :style="{ backgroundColor: 'var(--accent)' }"></div>
        <div class="space-y-4">
          <p v-for="(p, i) in block.paragraphs" :key="i"
             class="leading-relaxed" :style="{ color: 'var(--muted)' }">
            {{ p }}
          </p>
          <ul v-if="block.items" class="space-y-2 pl-1">
            <li v-for="(item, i) in block.items" :key="i" class="flex items-start gap-3" :style="{ color: 'var(--muted)' }">
              <span :style="{ color: 'var(--accent)' }" class="mt-1">•</span>
              <span><strong :style="{ color: 'var(--text-color)' }">{{ item.label }}</strong> — {{ item.detail }}</span>
            </li>
          </ul>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup lang="ts">
const sections = [
  {
    title: 'Information we collect',
    paragraphs: [
      'We only collect what\'s needed to run the app:'
    ],
    items: [
      { label: 'Account info', detail: 'when you sign in with Google or Apple, we receive your email address and a unique identifier from that provider. We never see or store your Google/Apple password — sign-in is handled entirely by them.' },
      { label: 'Profile info', detail: 'your username, an optional bio, and an optional profile picture you upload.' },
      { label: 'Content you create', detail: 'campsite listings you add (including their location, description, and photos), reviews, and visit records.' },
      { label: 'Device location', detail: 'if you tap "find my location" on the map, your device\'s GPS position is used to center the map — this happens entirely on your device and is never sent to or stored on our servers.' },
    ]
  },
  {
    title: 'How we use it',
    paragraphs: [
      'Your information is used only to operate Boondock: authenticating you, displaying your profile and contributions to other users, showing campsites on the map, and letting you manage the content you\'ve created. We don\'t sell your data, and we don\'t use it for advertising.'
    ]
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Boondock relies on a small number of external services to work:'
    ],
    items: [
      { label: 'Google / Apple', detail: 'for sign-in. Their own privacy policies govern how they handle your account data on their end.' },
      { label: 'Mapbox', detail: 'provides the map tiles and rendering. Mapbox may process technical data (like map tile requests) under its own privacy policy.' },
      { label: 'Google Cloud Storage', detail: 'hosts profile pictures and campsite photos you upload. Images are uploaded directly from your device to storage — our servers never handle the raw file.' },
    ]
  },
  {
    title: 'Cookies and local storage',
    paragraphs: [
      'After signing in, your session is kept using a security token stored in your browser or app\'s local storage — not a tracking cookie. A short-lived cookie is used only during the sign-in handshake itself and is cleared immediately after.'
    ]
  },
  {
    title: 'Your choices',
    paragraphs: [
      'You can edit or remove your profile picture, bio, and any campsite, review, or visit you\'ve created at any time from within the app. To deactivate your account or request deletion of your data, email us at the address above and we\'ll action it promptly.'
    ]
  },
  {
    title: 'Children',
    paragraphs: [
      'Boondock isn\'t directed at children, and we don\'t knowingly collect information from anyone under 13.'
    ]
  },
  {
    title: 'Changes to this policy',
    paragraphs: [
      'If this policy changes, we\'ll update the date at the top of this page. Significant changes will be communicated within the app.'
    ]
  },
]
</script>
