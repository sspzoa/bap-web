const INQUIRY_MAIL = "me@sspzoa.io";

/** Small mailto chip. Sits above the creative so it does not follow the banner link. */
export function AdInquiryLink() {
  return (
    <a
      href={`mailto:${INQUIRY_MAIL}`}
      className="absolute top-1 left-1 z-20 rounded bg-black/45 px-1 py-px text-[9px] text-white/90 leading-none">
      {INQUIRY_MAIL}
    </a>
  );
}
