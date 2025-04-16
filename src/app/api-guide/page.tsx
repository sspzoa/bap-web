import Glass from '@/components/Glass';
import Image from 'next/image';

export default function ApiGuide() {
  return (
    <div className="p-4 md:p-8">
      <Image
        src="/img/dinner.svg"
        alt="저녁 배경"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: '50% 90%',
        }}
        priority
        draggable={false}
      />
      <Glass>
        <h1>API Guide</h1>
        <p>This is the API guide page.</p>
      </Glass>
    </div>
  );
}
