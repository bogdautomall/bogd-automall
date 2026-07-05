"use client";

import * as React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FacebookIcon, InstagramIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n/language-context";

const PHONE_NUMBERS = ["80111501", "88665160", "88835160"];
const EMAIL = "bogd.automall@gmail.com";
const FACEBOOK_URL = "https://www.facebook.com/Bogd.Automall";
const INSTAGRAM_URL = "https://www.instagram.com/bogd_automall";
const MAP_QUERY = "Food City Mall, Yarmag, Ulaanbaatar, Mongolia";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${t.contact.formName}: ${name}\n${t.contact.formPhone}: ${phone}\n\n${message}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Bogd Automall — вэбсайтаас ирсэн асуулт"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {t.contact.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-5 rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.contact.addressLabel}
                </p>
                <p>{t.contact.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.contact.phoneLabel}
                </p>
                <p className="font-mono">{PHONE_NUMBERS.join(" · ")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.contact.emailLabel}
                </p>
                <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                  {EMAIL}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.contact.hoursLabel}
                </p>
                <p>{t.contact.hours}</p>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                {t.contact.socialTitle}
              </p>
              <div className="flex gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <FacebookIcon className="size-4" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title={t.contact.mapTitle}
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                MAP_QUERY
              )}&output=embed`}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">
            {t.contact.formTitle}
          </h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="name" className="mb-1.5">
                {t.contact.formName}
              </Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-1.5">
                {t.contact.formPhone}
              </Label>
              <Input
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message" className="mb-1.5">
                {t.contact.formMessage}
              </Label>
              <Textarea
                id="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {t.contact.formSubmit}
            </Button>
            <p className="text-xs text-muted-foreground">{t.contact.formNote}</p>
          </form>
        </div>
      </div>
    </main>
  );
}
