import React from "react";
import { MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { PageInfo } from "../typings";
import Link from "next/link";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Props = {
  pageInfo: PageInfo;
};

export default function ContactMe({ pageInfo }: Props) {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    const body = `Hi, my name is ${formData.name}.\nReply to: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:${pageInfo.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen flex flex-col text-center max-w-3xl px-5 py-20 mx-auto items-center justify-center">
      <h3 className="uppercase tracking-[0.4em] text-gray-500 text-xl mb-8">
        Contact
      </h3>

      <div className="flex flex-col space-y-8 w-full">
        <h4 className="text-3xl md:text-4xl font-semibold text-center break-normal max-w-xl mx-auto">
          I have got just what you need.{" "}
          <span className="underline block decoration-[#F7AB0A]/50">
            Let&apos;s Talk.
          </span>
        </h4>

        <div className="flex flex-col gap-5">
          <Link href={`mailto:${pageInfo?.email}`}>
            <div className="flex items-center gap-3 justify-center min-w-0 cursor-pointer">
              <EnvelopeIcon className="h-6 w-6 shrink-0 text-[#F7AB0A]" />
              <p className="text-sm sm:text-base break-all">{pageInfo?.email}</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 justify-center min-w-0">
            <MapPinIcon className="h-6 w-6 shrink-0 text-[#F7AB0A]" />
            <p className="text-sm sm:text-base break-all">{pageInfo?.address}</p>
          </div>
        </div>
        <form
          className="flex flex-col gap-3 w-full max-w-xl mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              {...register("name", { required: true })}
              aria-label="Name"
              required
              className="contactInput w-full min-w-0"
              type="text"
              placeholder="Name"
            />
            <input
              {...register("email", { required: true })}
              aria-label="Email"
              required
              className="contactInput w-full min-w-0"
              type="email"
              placeholder="Email"
            />
          </div>

          <input
            {...register("subject", { required: true })}
              aria-label="Subject"
              required
            className="contactInput w-full min-w-0"
            type="text"
            placeholder="Subject"
          />

          <textarea
            {...register("message", { required: true })}
              aria-label="Message"
              required
            className="contactInput w-full min-w-0"
            placeholder="Message"
            rows={4}
          />

          <button
            type="submit"
            className="bg-[#F7AB0A] py-3 md:py-4 px-10 rounded-md text-black font-bold text-lg"
          >
            Open email draft
          </button>
          <p className="text-xs text-gray-400">Opens your email app so you can review and send your message.</p>
        </form>
      </div>
    </div>
  );
}
