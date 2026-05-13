# Motion Photo Support Design

## Scope

Add support for Android/Google/Samsung-style single-file Motion Photo uploads. These files are uploaded as one JPG/JPEG or HEIC image that contains a still image plus an embedded video resource described by XMP motion photo metadata. Apple Live Photo HEIC+MOV paired uploads are intentionally out of scope for this iteration.

## Backend

`../brando-node` keeps the existing `POST /api/v1/images` single-file upload shape. During upload, the image route detects Motion Photo metadata in the original file. When a motion video resource is present, the backend extracts the video bytes, uploads them separately to S3, and stores the video object path in a new `Image.livePhoto` JSON field. The existing WebP image processing, watermarking, proxy image generation, deduplication, and album APIs continue to work for still images.

The backend returns `image.livePhoto` only when a video was extracted. The field is shaped for future extension but only implements single-file Motion Photo now:

```ts
{
  videoPath: string;
  mime: 'video/mp4' | 'video/quicktime';
  presentationTimestampUs?: number;
}
```

`processImageObj` converts `livePhoto.videoPath` to the CDN URL in the same way it already converts `objectPath` and `proxied`.

## Frontend

`semporna` extends `ImageModel` with optional `livePhoto`. The album modal slider renders an overlaid `<video>` only for photos that include `photo.image.livePhoto`. The toolbar shows a LIVE Photo button only for those photos. Clicking the button replays the video. By default, the video is muted and autoplay plays once when the current slide becomes active.

Hovering the LIVE Photo toolbar button opens a compact menu with two switches: mute and autoplay. Mute defaults on. Autoplay defaults on. The component uses native browser video playback instead of a player dependency.

## Testing

Backend tests cover Motion Photo metadata parsing, video extraction bounds, non-motion fallback, and CDN serialization of `livePhoto`. Frontend tests cover small state helpers for autoplay/replay eligibility so the Vue component behavior is not buried in template-only logic.
