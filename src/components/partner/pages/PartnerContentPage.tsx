import { useState } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Image, Users, Star, MapPin, Phone, Clock, Upload, Pencil, Plus, Trash2 } from "lucide-react";

const tabs = [
  { id: "banners", label: "Баннеры", icon: Image },
  { id: "staff", label: "Сотрудники", icon: Users },
  { id: "reviews", label: "Отзывы", icon: Star },
  { id: "contacts", label: "Контакты", icon: MapPin },
];

const mockStaff = [
  { id: 1, name: "Алексей Морозов", role: "Менеджер", photo: "" },
  { id: 2, name: "Елена Козлова", role: "Дизайнер-консультант", photo: "" },
  { id: 3, name: "Дмитрий Волков", role: "Замерщик", photo: "" },
];

const mockReviews = [
  { id: 1, author: "Иванова Т.", rating: 5, text: "Отличный салон! Помогли подобрать двери для всей квартиры.", date: "15 марта 2026" },
  { id: 2, author: "Петров С.", rating: 4, text: "Быстрая доставка и установка. Рекомендую.", date: "10 марта 2026" },
];

export function PartnerContentPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <PartnerHeader title="Контент сайта" onNavigate={onNavigate} />

      <p className="text-sm text-muted-foreground mb-5">Управляйте содержимым вашего сайта-витрины. Изменения отобразятся на публичной странице салона.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banners */}
      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Баннеры главной страницы</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />
              Добавить
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden group">
                <div className="h-36 bg-muted flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Баннер {i}</p>
                    <p className="text-[11px] text-muted-foreground">1920 × 600 px</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-foreground/20 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Перетащите изображение или нажмите для загрузки</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">PNG, JPG до 5 МБ</p>
          </div>
        </div>
      )}

      {/* Staff */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Сотрудники салона</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />
              Добавить
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockStaff.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.role}</p>
                </div>
                <div className="flex gap-1">
                  <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Отзывы клиентов</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />
              Добавить
            </button>
          </div>
          <div className="space-y-3">
            {mockReviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{r.author}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Контактная информация</h2>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            {[
              { label: "Адрес", value: "г. Москва, ул. Митинская, д. 28, ТЦ «Двери Мира»", icon: MapPin },
              { label: "Телефон", value: "+7 (495) 123-45-67", icon: Phone },
              { label: "Время работы", value: "Пн-Сб: 10:00–20:00, Вс: 11:00–18:00", icon: Clock },
            ].map((field, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <field.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">{field.label}</p>
                  <p className="text-sm text-foreground">{field.value}</p>
                </div>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          {/* Map placeholder */}
          <div className="rounded-2xl border border-border bg-muted h-48 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Карта будет подключена позже</p>
          </div>
        </div>
      )}
    </div>
  );
}
