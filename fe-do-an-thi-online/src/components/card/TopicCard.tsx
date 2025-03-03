'use client';

interface TopicCardProps {
  topic: string
  description: string
}


export const TopicCard = ({ topic, description }: TopicCardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md max-w-sm w-96">
      <h2 className="text-xl font-bold mb-2">{topic}</h2>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  );
};