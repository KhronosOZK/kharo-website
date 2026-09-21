import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

/**
 * The one FAQ. Hairline rows, no card, one open at a time so the page height
 * stays steady while someone reads.
 */
export default function Faq({ items, className = "", testId = "faq" }) {
  return (
    <Accordion type="single" collapsible className={`divide-y divide-line border-y border-line ${className}`} data-testid={testId}>
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`} className="border-0 py-1" data-testid={`${testId}-item`}>
          <AccordionTrigger className="py-5 text-left font-heading text-[17px] sm:text-[18px] font-semibold text-ink hover:no-underline [&>svg]:text-green [&>svg]:h-5 [&>svg]:w-5">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-0 text-[15px] leading-relaxed text-ink-2 measure">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
