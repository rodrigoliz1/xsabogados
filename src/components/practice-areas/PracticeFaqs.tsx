import { Plus } from "lucide-react";

import type { PracticeFaq } from "@/data/practice-areas";

type PracticeFaqsProps = {
  faqs: readonly PracticeFaq[];
};

export function PracticeFaqs({ faqs }: PracticeFaqsProps) {
  return (
    <div className="border-t border-white/15">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group border-b border-white/15 py-1"
        >
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg text-paper marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:text-xl [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-paper-quiet transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              strokeWidth={1.25}
            />
          </summary>
          <p className="max-w-3xl pb-7 pr-10 text-base leading-7 text-paper-muted">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
