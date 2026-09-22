# Katie Palecek — Portfolio

Open `index.html` in a browser, or run `python -m http.server 8000` and visit http://localhost:8000.

- `index.html`: page content and sections
- `styles.css`: responsive design based on the six September 21 reference screenshots
- `projects.js`: existing project records
- `portfolio.js`: filters, project dialogs, and section navigation
- `images/wbp/`: web-sized Wild Bill Pickles photos and brand art (flames, logo, wordmark) used in that project's popup
- `portfolio-original.html`: preserved previous design (local backup)

The page uses a locally saved landscape photo by Caleb Kastein from Unsplash; attribution is in the footer. Travel illustrations are the original supplied assets. The résumé PDF (`Palecek_Katie_UpdatedResume_2026.pdf`) sits beside `index.html`; replace it with the same filename to update the link. `connect.html` is a placeholder for the links page. The inherited Iberian research entry still needs its details confirmed, as noted in `projects.js`.

`dist/` contains the static publishing copy. Copy the four site files and used images into it after edits before publishing.

## Adding videos to a project popup

In `projects.js`, add a `videos` list to any project:

```js
videos: [
  { url: 'https://youtu.be/VIDEO_ID', title: 'Prototype walkthrough' },
  { url: 'https://vimeo.com/123456789', title: 'Demo day' },
  { url: 'videos/interview.mp4', title: 'Customer interview' },   // a file saved in a "videos" folder
  { url: 'https://youtube.com/shorts/VIDEO_ID', ratio: '9 / 16' }  // vertical video
],
```

- YouTube and Vimeo links work as-is. Upload to YouTube as "Unlisted" to keep them off your channel page.
- Files (`.mp4`, `.webm`, `.mov`) go in a `videos/` folder next to `index.html` (copy that folder into `dist/` too). Keep them small; YouTube is better for anything long.
- YouTube/Vimeo embeds only play when the site is served from a web address (published, or run `python -m http.server 8000` and open http://localhost:8000). Double-clicking `index.html` shows "Error 153".

