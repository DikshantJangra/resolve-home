import {
  AlarmClock,
  Banknote,
  CalendarClock,
  CircleHelp,
  MapPinned,
  ShieldCheck,
  TimerReset,
  Wrench,
} from 'lucide-react';

const faqs = [
  {
    question: 'How quickly can I book a service?',
    answer:
      "Book in under 60 seconds: pick a service, enter your address, choose a time, and you're set.",
    icon: TimerReset,
  },
  {
    question: 'Are your engineers verified?',
    answer:
      'Every Resolv engineer is COREN & SON certified, identity-verified, and background-checked before entering your home.',
    icon: ShieldCheck,
  },
  {
    question: 'Which cities do you currently cover?',
    answer:
      "We're live in Lagos, Abuja, and Port Harcourt, expanding fast to Ibadan, Enugu, and Kano.",
    icon: MapPinned,
  },
  {
    question: 'How does emergency booking work?',
    answer:
      'Tap Emergency anytime. We prioritize your job and dispatch the nearest engineer quickly.',
    icon: AlarmClock,
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept cards, bank transfers, and NGN via Paystack. Transactions are encrypted and receipts sent instantly.',
    icon: Banknote,
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer:
      'Cancel or reschedule free within 3 minutes of booking, right from the app.',
    icon: CalendarClock,
  },
  {
    question: "What if I'm not happy with the work?",
    answer:
      "Our satisfaction guarantee means if the issue isn't fixed, we send another engineer at no cost.",
    icon: CircleHelp,
  },
  {
    question: 'How do membership plans save me money?',
    answer:
      'Members get up to 15% off callouts, priority access, and annual visits that pay for themselves after one job.',
    icon: Wrench,
  },
];

export const ContactFAQ = () => {
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="max-w-[620px]">
          <p className="text-xl font-bold text-blue-700">Frequently Asked Question</p>
          <h2 className="mt-1 text-4xl font-bold text-neutral-700">
            Everything you need to know.
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-8 xl:grid-cols-[560px_minmax(0,1fr)]">
          <div className="rounded-xl border border-zinc-300 bg-stone-50 p-8">
            <p className="text-[18px] leading-[1.6] text-[#505866]">
              Can&apos;t find your answer here? Reach us by filling the form below or call
              <span className="block mt-2 font-bold text-[#2E3645]"> +234 800 123 4567.</span>
            </p>

            <form className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-2 block text-[15px] font-bold text-[#2E3645]">
                    First Name <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    id="first-name"
                    placeholder="e.g Yemi"
                    className="h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-white px-4 text-[15px] text-[#2E3645] outline-none transition-colors placeholder:text-[#C0C6D0] focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label htmlFor="last-name" className="mb-2 block text-[15px] font-bold text-[#2E3645]">
                    Last Name <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    id="last-name"
                    placeholder="e.g Samuel"
                    className="h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-white px-4 text-[15px] text-[#2E3645] outline-none transition-colors placeholder:text-[#C0C6D0] focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-[15px] font-bold text-[#2E3645]">
                  Email Address <span className="text-[#FF4D4F]">*</span>
                </label>
                <input
                  id="email"
                  placeholder="e.g Yemi.fig@mail.com"
                  className="h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-white px-4 text-[15px] text-[#2E3645] outline-none transition-colors placeholder:text-[#C0C6D0] focus:border-brand-blue"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-[15px] font-bold text-[#2E3645]">
                  Message <span className="text-[#FF4D4F]">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full rounded-[8px] border border-[#D9D9D9] bg-white px-4 py-3 text-[15px] text-[#2E3645] outline-none transition-colors placeholder:text-[#C0C6D0] focus:border-brand-blue"
                />
              </div>

              <button type="submit" className="h-[44px] w-full rounded-[10px] bg-[#1A56DB] text-sm font-medium text-white">Send</button>
            </form>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => {
              const Icon = faq.icon;
              return (
                <article
                  key={faq.question}
                  className="rounded-xl border border-zinc-300 bg-white p-5"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6F7FA] text-[#8D95A3]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm leading-5 font-bold text-neutral-700">
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-sm leading-5 text-zinc-600">{faq.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
