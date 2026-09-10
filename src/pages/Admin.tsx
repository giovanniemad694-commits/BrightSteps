import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut, Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp, Calendar, BookOpen,
  ImageOff, AlertCircle, CheckCircle2, Eye,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Patriarch, PatriarchEvent, PatriarchSource } from '@/types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import AdminParticles from '@/components/AdminParticles';

interface EditingPatriarch {
  name_ar: string;
  name_en: string;
  papal_number: string;
  century: string;
  birth_date: string;
  death_date: string;
  papacy_start: string;
  papacy_end: string;
  short_bio_ar: string;
  biography_ar: string;
  historical_background_ar: string;
  faith_defense_ar: string;
  challenges_ar: string;
  contributions_ar: string;
  image_url: string;
  image_source: string;
  image_credit: string;
}

const emptyPatriarch: EditingPatriarch = {
  name_ar: '', name_en: '', papal_number: '', century: '', birth_date: '', death_date: '',
  papacy_start: '', papacy_end: '', short_bio_ar: '', biography_ar: '',
  historical_background_ar: '', faith_defense_ar: '', challenges_ar: '',
  contributions_ar: '', image_url: '', image_source: '', image_credit: '',
};

export default function Admin() {
  const { t, language } = useLanguage();
  const [session, setSession] = useState<{ user: { email: string } } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [patriarchs, setPatriarchs] = useState<Patriarch[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [editing, setEditing] = useState<EditingPatriarch | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [events, setEvents] = useState<PatriarchEvent[]>([]);
  const [sources, setSources] = useState<PatriarchSource[]>([]);
  const [saving, setSaving] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const missingImages = useMemo(
    () => patriarchs.filter((p) => !p.image_url || p.image_url.trim() === ''),
    [patriarchs],
  );
  const hasImageCount = patriarchs.length - missingImages.length;
  const brokenCount = brokenImages.size;

  const markImageBroken = useCallback((id: string) => {
    setBrokenImages((prev) => new Set(prev).add(id));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.adminTheme = 'dark';
    return () => { delete document.documentElement.dataset.adminTheme; };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session as typeof session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess as typeof session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchPatriarchs = useCallback(async () => {
    setLoadingData(true);
    setDataError(null);
    const { data, error } = await supabase.from('patriarchs').select('*').order('papal_number', { ascending: true });
    if (error) setDataError(error.message);
    else setPatriarchs(data || []);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (session) fetchPatriarchs();
  }, [session, fetchPatriarchs]);

  const fetchRelations = async (patriarchId: string) => {
    const [{ data: eData }, { data: sData }] = await Promise.all([
      supabase.from('patriarch_events').select('*').eq('patriarch_id', patriarchId).order('sort_order'),
      supabase.from('patriarch_sources').select('*').eq('patriarch_id', patriarchId).order('created_at'),
    ]);
    setEvents(eData || []);
    setSources(sData || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const startAdd = () => {
    setEditing({ ...emptyPatriarch });
    setEditId(null);
  };

  const startEdit = (p: Patriarch) => {
    setEditing({
      name_ar: p.name_ar, name_en: p.name_en, papal_number: String(p.papal_number),
      century: String(p.century), birth_date: p.birth_date || '', death_date: p.death_date || '',
      papacy_start: p.papacy_start || '', papacy_end: p.papacy_end || '',
      short_bio_ar: p.short_bio_ar, biography_ar: p.biography_ar,
      historical_background_ar: p.historical_background_ar || '',
      faith_defense_ar: p.faith_defense_ar || '', challenges_ar: p.challenges_ar || '',
      contributions_ar: p.contributions_ar || '', image_url: p.image_url || '',
      image_source: p.image_source || '', image_credit: p.image_credit || '',
    });
    setEditId(p.id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditId(null);
  };

  const savePatriarch = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      name_ar: editing.name_ar,
      name_en: editing.name_en,
      papal_number: Number(editing.papal_number),
      century: Number(editing.century),
      birth_date: editing.birth_date || null,
      death_date: editing.death_date || null,
      papacy_start: editing.papacy_start || null,
      papacy_end: editing.papacy_end || null,
      short_bio_ar: editing.short_bio_ar,
      biography_ar: editing.biography_ar,
      historical_background_ar: editing.historical_background_ar || null,
      faith_defense_ar: editing.faith_defense_ar || null,
      challenges_ar: editing.challenges_ar || null,
      contributions_ar: editing.contributions_ar || null,
      image_url: editing.image_url || null,
      image_source: editing.image_source || null,
      image_credit: editing.image_credit || null,
    };

    if (editId) {
      const { error } = await supabase.from('patriarchs').update(payload).eq('id', editId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('patriarchs').insert(payload);
      if (error) alert(error.message);
    }

    setSaving(false);
    cancelEdit();
    fetchPatriarchs();
  };

  const deletePatriarch = async (id: string) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    const { error } = await supabase.from('patriarchs').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchPatriarchs();
  };

  const addEvent = async (patriarchId: string) => {
    const title = prompt(language === 'ar' ? 'عنوان الحدث' : 'Event title');
    if (!title) return;
    const eventDate = prompt(language === 'ar' ? 'تاريخ الحدث' : 'Event date') || '';
    const description = prompt(language === 'ar' ? 'وصف الحدث' : 'Description') || '';
    const { error } = await supabase.from('patriarch_events').insert({
      patriarch_id: patriarchId,
      title_ar: title,
      description_ar: description,
      event_date: eventDate,
    });
    if (error) alert(error.message);
    else fetchRelations(patriarchId);
  };

  const deleteEvent = async (eventId: string, patriarchId: string) => {
    const { error } = await supabase.from('patriarch_events').delete().eq('id', eventId);
    if (error) alert(error.message);
    else fetchRelations(patriarchId);
  };

  const addSource = async (patriarchId: string) => {
    const title = prompt(language === 'ar' ? 'عنوان المصدر' : 'Source title');
    if (!title) return;
    const url = prompt(language === 'ar' ? 'الرابط' : 'URL') || '';
    const sourceType = prompt(language === 'ar' ? 'النوع (book/document/website)' : 'Type (book/document/website)') || 'book';
    const { error } = await supabase.from('patriarch_sources').insert({
      patriarch_id: patriarchId,
      title,
      url: url || null,
      source_type: sourceType,
    });
    if (error) alert(error.message);
    else fetchRelations(patriarchId);
  };

  const deleteSource = async (sourceId: string, patriarchId: string) => {
    const { error } = await supabase.from('patriarch_sources').delete().eq('id', sourceId);
    if (error) alert(error.message);
    else fetchRelations(patriarchId);
  };

  if (!authChecked) return <LoadingState />;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-2xl mx-auto text-center">
        <ErrorState message="Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file." />
      </div>
    );
  }

  // Login screen
  if (!session) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #080b0f 0%, #0e1318 40%, #121820 100%)' }}
      >
        <div className="absolute inset-0 coptic-cross-pattern opacity-30" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(138, 40, 40, 0.12), transparent 50%)' }} />
        <AdminParticles />

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #8a2828, #5a1818)', boxShadow: '0 8px 24px rgba(138, 40, 40, 0.3)' }}>
              <ShieldIcon />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--adm-ink)', fontFamily: "'Amiri', serif" }}>
              {t('admin.title')}
            </h1>
            <p className="text-sm" style={{ color: 'var(--adm-ink-muted)' }}>{t('admin.login')}</p>
            <div className="w-16 h-0.5 mx-auto mt-4" style={{ background: 'var(--adm-gold)' }} />
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-2xl p-8 space-y-4"
            style={{
              background: 'var(--adm-surface)',
              border: '1px solid var(--adm-border)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div>
              <label className="adm-label">{t('admin.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="adm-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="adm-label">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="adm-input"
                style={{ width: '100%' }}
              />
            </div>
            {loginError && <p className="text-sm" style={{ color: '#e85d5d' }}>{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--adm-burgundy), var(--adm-burgundy-deep))',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(138, 40, 40, 0.3)',
              }}
            >
              {loginLoading ? '...' : t('admin.login_button')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #080b0f 0%, #0e1318 50%, #111820 100%)' }}
    >
      <div className="absolute inset-0 coptic-cross-pattern opacity-20" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 10%, rgba(138, 40, 40, 0.08), transparent 45%), radial-gradient(circle at 20% 80%, rgba(198, 161, 91, 0.06), transparent 40%)' }} />
      <AdminParticles />

      <div className="relative z-10 py-12 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--adm-ink)', fontFamily: "'Amiri', serif" }}>
              {t('admin.title')}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--adm-ink-muted)' }}>{session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
            style={{ border: '1px solid var(--adm-gold)', color: 'var(--adm-gold-bright)' }}
          >
            <LogOut className="w-4 h-4" />
            {t('admin.logout')}
          </button>
        </div>

        {/* Add button */}
        {!editing && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--adm-burgundy), var(--adm-burgundy-deep))',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(138, 40, 40, 0.25)',
            }}
          >
            <Plus className="w-5 h-5" />
            {t('admin.add_patriarch')}
          </button>
        )}

        {/* Edit form */}
        {editing && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{
              background: 'var(--adm-surface)',
              border: '1px solid var(--adm-border-strong)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--adm-ink)' }}>
              {editId ? t('admin.edit') : t('admin.add_patriarch')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="adm-label">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input className="adm-input" value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input className="adm-input" value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'رقم البابوية' : 'Papal Number'}</label>
                <input type="number" className="adm-input" value={editing.papal_number} onChange={(e) => setEditing({ ...editing, papal_number: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'القرن' : 'Century'}</label>
                <input type="number" className="adm-input" value={editing.century} onChange={(e) => setEditing({ ...editing, century: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                <input className="adm-input" value={editing.birth_date} onChange={(e) => setEditing({ ...editing, birth_date: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'تاريخ النياحة' : 'Death Date'}</label>
                <input className="adm-input" value={editing.death_date} onChange={(e) => setEditing({ ...editing, death_date: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'بداية البابوية' : 'Papacy Start'}</label>
                <input className="adm-input" value={editing.papacy_start} onChange={(e) => setEditing({ ...editing, papacy_start: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'نهاية البابوية' : 'Papacy End'}</label>
                <input className="adm-input" value={editing.papacy_end} onChange={(e) => setEditing({ ...editing, papacy_end: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'سيرة مختصرة' : 'Short Bio'}</label>
                <textarea className="adm-input" rows={2} value={editing.short_bio_ar} onChange={(e) => setEditing({ ...editing, short_bio_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'السيرة الكاملة' : 'Biography'}</label>
                <textarea className="adm-input" rows={4} value={editing.biography_ar} onChange={(e) => setEditing({ ...editing, biography_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'الخلفية التاريخية' : 'Historical Background'}</label>
                <textarea className="adm-input" rows={3} value={editing.historical_background_ar} onChange={(e) => setEditing({ ...editing, historical_background_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'كيف حافظ على الإيمان' : 'Faith Defense'}</label>
                <textarea className="adm-input" rows={3} value={editing.faith_defense_ar} onChange={(e) => setEditing({ ...editing, faith_defense_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'التحديات' : 'Challenges'}</label>
                <textarea className="adm-input" rows={2} value={editing.challenges_ar} onChange={(e) => setEditing({ ...editing, challenges_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'الإسهامات' : 'Contributions'}</label>
                <textarea className="adm-input" rows={2} value={editing.contributions_ar} onChange={(e) => setEditing({ ...editing, contributions_ar: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="adm-label">{language === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
                <input className="adm-input" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://upload.wikimedia.org/..." />
                {editing.image_url && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center shrink-0" style={{ borderColor: 'var(--adm-border)', background: 'var(--adm-surface-raised)' }}>
                      <img
                        key={editing.image_url}
                        src={editing.image_url}
                        alt={language === 'ar' ? 'معاينة الصورة' : 'Image preview'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                      />
                      <div className="hidden text-xs text-center px-2" style={{ color: '#e85d5d' }}>
                        <ImageOff className="w-5 h-5 mx-auto mb-1" />
                        {language === 'ar' ? 'فشل التحميل' : 'Failed to load'}
                      </div>
                    </div>
                    <a
                      href={editing.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors"
                      style={{ color: 'var(--adm-gold)' }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'فتح الصورة' : 'Open image'}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'مصدر الصورة' : 'Image Source'}</label>
                <input className="adm-input" value={editing.image_source} onChange={(e) => setEditing({ ...editing, image_source: e.target.value })} />
              </div>
              <div>
                <label className="adm-label">{language === 'ar' ? 'حقوق الصورة' : 'Image Credit'}</label>
                <input className="adm-input" value={editing.image_credit} onChange={(e) => setEditing({ ...editing, image_credit: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={savePatriarch}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--adm-burgundy), var(--adm-burgundy-deep))',
                  color: '#fff',
                  boxShadow: '0 6px 16px rgba(138, 40, 40, 0.25)',
                }}
              >
                <Save className="w-4 h-4" />
                {saving ? '...' : t('admin.save')}
              </button>
              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ border: '1px solid var(--adm-border-strong)', color: 'var(--adm-ink-soft)' }}
              >
                <X className="w-4 h-4" />
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Patriarch list */}
        {loadingData ? (
          <LoadingState />
        ) : dataError ? (
          <ErrorState message={dataError} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--adm-ink)' }}>{t('admin.patriarch_list')}</h2>

            {/* Image Audit Panel */}
            <div
              className="rounded-xl p-4"
              style={{
                border: `1px solid ${missingImages.length === 0 && brokenCount === 0 ? 'rgba(72, 187, 120, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                background: missingImages.length === 0 && brokenCount === 0 ? 'rgba(72, 187, 120, 0.08)' : 'rgba(234, 179, 8, 0.08)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                {missingImages.length === 0 && brokenCount === 0 ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#48bb78' }} />
                ) : (
                  <AlertCircle className="w-5 h-5" style={{ color: '#eab308' }} />
                )}
                <h3 className="text-sm font-bold" style={{ color: 'var(--adm-ink)' }}>
                  {language === 'ar' ? 'تدقيق الصور' : 'Image Audit'}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {[
                  { label: language === 'ar' ? 'إجمالي البطاركة' : 'Total Patriarchs', value: patriarchs.length, color: 'var(--adm-ink)' },
                  { label: language === 'ar' ? 'لديه صورة' : 'Has Image', value: hasImageCount, color: '#48bb78' },
                  { label: language === 'ar' ? 'بدون صورة' : 'Missing', value: missingImages.length, color: '#eab308' },
                  { label: language === 'ar' ? 'روابط معطوبة' : 'Broken URLs', value: brokenCount, color: brokenCount > 0 ? '#e85d5d' : '#48bb78' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg p-3 text-center" style={{ background: 'var(--adm-surface-raised)', border: '1px solid var(--adm-border)' }}>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--adm-ink-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              {missingImages.length > 0 && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(234, 179, 8, 0.06)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--adm-ink)' }}>
                    {language === 'ar' ? `باتاركة بدون صورة (${missingImages.length}):` : `Patriarchs missing images (${missingImages.length}):`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingImages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                        style={{ border: '1px solid rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}
                      >
                        <ImageOff className="w-3 h-3" />
                        #{p.papal_number} {language === 'ar' ? p.name_ar : p.name_en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {brokenCount > 0 && (
                <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(232, 93, 93, 0.06)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--adm-ink)' }}>
                    {language === 'ar' ? `روابط صور معطوبة (${brokenCount}):` : `Broken image URLs (${brokenCount}):`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {patriarchs.filter((p) => brokenImages.has(p.id)).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                        style={{ border: '1px solid rgba(232, 93, 93, 0.3)', background: 'rgba(232, 93, 93, 0.1)', color: '#e85d5d' }}
                      >
                        <ImageOff className="w-3 h-3" />
                        #{p.papal_number} {language === 'ar' ? p.name_ar : p.name_en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {patriarchs.map((p) => (
              <div key={p.id} className="rounded-xl overflow-hidden" style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)' }}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: 'var(--adm-burgundy-deep)' }}>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                          onError={() => markImageBroken(p.id)}
                        />
                      ) : (
                        <ImageOff className="w-4 h-4" style={{ color: 'var(--adm-gold)' }} />
                      )}
                    </div>
                    <span className="text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--adm-burgundy)', color: 'var(--adm-gold)' }}>
                      {p.papal_number}
                    </span>
                    <span className="font-semibold truncate" style={{ color: 'var(--adm-ink)' }}>
                      {language === 'ar' ? p.name_ar : p.name_en}
                    </span>
                    {brokenImages.has(p.id) && (
                      <ImageOff className="w-4 h-4 shrink-0" style={{ color: '#e85d5d' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--adm-gold)' }} title={t('admin.edit')}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deletePatriarch(p.id)} className="p-2 rounded-lg transition-colors" style={{ color: '#e85d5d' }} title={t('admin.delete')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (expandedId === p.id) {
                          setExpandedId(null);
                        } else {
                          setExpandedId(p.id);
                          fetchRelations(p.id);
                        }
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--adm-ink-muted)' }}
                    >
                      {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {expandedId === p.id && (
                  <div className="border-t p-4 space-y-4" style={{ borderColor: 'var(--adm-border)', background: 'var(--adm-bg-deep)' }}>
                    {/* Image info */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4" style={{ color: 'var(--adm-gold)' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--adm-ink)' }}>
                          {language === 'ar' ? 'معلومات الصورة' : 'Image Info'}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0" style={{ borderColor: 'var(--adm-border)', background: 'var(--adm-surface-raised)' }}>
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt=""
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                              onError={() => markImageBroken(p.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-5 h-5" style={{ color: 'var(--adm-ink-muted)' }} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-xs space-y-1">
                          <div>
                            <span style={{ color: 'var(--adm-ink-muted)' }}>{language === 'ar' ? 'الرابط: ' : 'URL: '}</span>
                            <span className="break-all" style={{ color: 'var(--adm-ink-soft)' }}>{p.image_url || (language === 'ar' ? '— غير محدد —' : '— not set —')}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--adm-ink-muted)' }}>{language === 'ar' ? 'المصدر: ' : 'Source: '}</span>
                            {p.image_source ? (
                              <a href={p.image_source} target="_blank" rel="noopener noreferrer" className="break-all transition-colors" style={{ color: 'var(--adm-gold)' }}>
                                {p.image_source}
                              </a>
                            ) : (
                              <span style={{ color: 'var(--adm-ink-muted)' }}>—</span>
                            )}
                          </div>
                          <div>
                            <span style={{ color: 'var(--adm-ink-muted)' }}>{language === 'ar' ? 'الحقوق: ' : 'Credit: '}</span>
                            <span style={{ color: 'var(--adm-ink-soft)' }}>{p.image_credit || (language === 'ar' ? '— غير محدد —' : '— not set —')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Events */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: 'var(--adm-gold)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--adm-ink)' }}>{t('details.events')}</span>
                        </div>
                        <button onClick={() => addEvent(p.id)} className="text-xs flex items-center gap-1 transition-colors" style={{ color: 'var(--adm-gold)' }}>
                          <Plus className="w-3 h-3" /> {t('admin.add_event')}
                        </button>
                      </div>
                      <div className="space-y-1">
                        {events.map((e) => (
                          <div key={e.id} className="flex items-center justify-between text-sm py-1">
                            <span style={{ color: 'var(--adm-ink-soft)' }}><strong>{e.event_date}:</strong> {e.title_ar}</span>
                            <button onClick={() => deleteEvent(e.id, p.id)} className="p-1 transition-colors" style={{ color: '#e85d5d' }}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {events.length === 0 && <p className="text-xs" style={{ color: 'var(--adm-ink-muted)' }}>—</p>}
                      </div>
                    </div>

                    {/* Sources */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" style={{ color: 'var(--adm-gold)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--adm-ink)' }}>{t('details.sources')}</span>
                        </div>
                        <button onClick={() => addSource(p.id)} className="text-xs flex items-center gap-1 transition-colors" style={{ color: 'var(--adm-gold)' }}>
                          <Plus className="w-3 h-3" /> {t('admin.add_source')}
                        </button>
                      </div>
                      <div className="space-y-1">
                        {sources.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-sm py-1">
                            <span style={{ color: 'var(--adm-ink-soft)' }}>{s.title}</span>
                            <button onClick={() => deleteSource(s.id, p.id)} className="p-1 transition-colors" style={{ color: '#e85d5d' }}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {sources.length === 0 && <p className="text-xs" style={{ color: 'var(--adm-ink-muted)' }}>—</p>}
                      </div>
                    </div>

                    <Link to={`/patriarchs/${p.id}`} className="text-xs transition-colors" style={{ color: 'var(--adm-gold)' }}>
                      {language === 'ar' ? 'عرض الصفحة العامة' : 'View public page'}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#e0bd76' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
