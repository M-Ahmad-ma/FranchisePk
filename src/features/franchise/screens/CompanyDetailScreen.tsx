import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { FranchiseStackParamList } from '../../../shared/types/navigation';
import {
  ArrowLeft,
  DollarSign,
  FileText,
  Percent,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Images,
  MapPin,
  Calendar,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Play,
  Phone,
  Globe,
  Mail,
  Camera,
  User,
} from 'lucide-react-native';
import FinancialStatsCard from '../components/FrachiseDetailCard';
import Card from '../../home/components/Card';
import Button from '../../../shared/components/Button';
import BottomSheet from '../../../shared/components/BottomSheet';
import Carousel from '../../home/components/Carousal';
import { useCompany } from '../../../shared/hooks/useCompanies';
import { imageUrl } from '../../../shared/api/imageUrl';
import { getCompanyCoverImage } from '../../../shared/utils/franchise';
import { Log } from '../../../shared/utils/Log';
import { Skeleton } from '../../../shared/components/Skeleton';
import { HTMLContentView } from '../../../shared/components/HTMLContentView';

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

function formatMoney(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') return '';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  const abs = Math.round(Math.abs(n)).toString();
  if (abs.length <= 3) return n < 0 ? `-${abs}` : abs;
  const last3 = abs.slice(-3);
  const rest = abs.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = `${rest},${last3}`;
  return n < 0 ? `-${grouped}` : grouped;
}

function pkr(value?: string | number | null): string {
  const formatted = formatMoney(value);
  return formatted ? `PKR ${formatted}` : '';
}

function meaningfulText(...values: (string | undefined | null)[]): string {
  for (const v of values) {
    if (!v) continue;
    const cleaned = v.replace(/\\+['"]/g, '').replace(/['"\\/]/g, '').trim();
    if (cleaned.length >= 3) return cleaned;
  }
  return '';
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <View className="w-1 h-4 rounded-full bg-primary-700" />
      <Text className="text-neutral-900 text-lg font-lato-bold">{children}</Text>
    </View>
  );
}

interface Fact {
  label: string;
  icon: ReactNode;
  value: string;
  accent?: string;
}

function FactGrid({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <View className="flex-row flex-wrap -mx-1 mt-6">
      {facts.map((fact, i) => (
        <View key={`${fact.label}-${i}`} className="w-1/2 px-1 mb-2">
          <View className="rounded-xl border border-neutral-200 bg-light p-3">
            <Text className="text-[10px] uppercase tracking-[0.12em] text-neutral-600 font-lato-bold">
              {fact.label}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1.5">
              {fact.icon}
              <Text className="text-neutral-900 font-lato-bold text-base" numberOfLines={1}>
                {fact.value}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function CompanyDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FranchiseStackParamList>>();
  const route = useRoute<RouteProp<FranchiseStackParamList, 'CompanyDetail'>>();
  const { slug } = route.params;

  const { data, isLoading, isError } = useCompany(slug);
  const company = data?.company;

  Log("related", data?.related)
  Log("company detail", company)

  const [sheetVisible, setSheetVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroImages = useMemo(() => {
    return (company?.company_images ?? [])
      .map((item) => {
        const raw =
          item.img_name && item.img_name !== '0' ? item.img_name : item.slider_image_name;
        return imageUrl(raw);
      })
      .filter((u): u is string => Boolean(u))
      .map((uri) => ({ uri }));
  }, [company?.company_images]);

  const videoId = useMemo(() => {
    if (company?.co_video_url) return extractVideoId(company.co_video_url);
    if (typeof company?.video_link === 'string' && /^[\w-]{11}$/.test(company.video_link)) {
      return company.video_link;
    }
    return null;
  }, [company?.co_video_url, company?.video_link]);

  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;

  const name = company?.co_name ?? '';
  const slogan = company?.brand_slogan || '';
  const location = [company?.co_city, company?.co_province].filter(Boolean).join(', ');
  const locationFull = [location, company?.co_country_id].filter(Boolean).join(' · ');

  const facts: Fact[] = [];
  if (company?.company_year && company.company_year !== '0') {
    facts.push({ label: 'Established', icon: <Calendar size={15} color="#436CF5" />, value: company.company_year });
  }
  if (company?.franchise_years && company.franchise_years !== '0') {
    facts.push({ label: 'Franchising since', icon: <BadgeCheck size={15} color="#00A572" />, value: company.franchise_years });
  }
  if (company?.co_security_fee != null && company.co_security_fee !== '') {
    facts.push({ label: 'Security fee', icon: <ShieldCheck size={15} color="#E0409A" />, value: pkr(company.co_security_fee) });
  }
  if (company?.commision_type && String(company.commision_type).trim()) {
    facts.push({ label: 'Commission', icon: <Percent size={15} color="#26C289" />, value: String(company.commision_type) });
  }
  if (Number(company?.franchise_turnover) > 0) {
    facts.push({ label: 'Franchise turnover', icon: <TrendingUp size={15} color="#436CF5" />, value: pkr(company?.franchise_turnover) });
  }
  if (Number(company?.average_turnover) > 0) {
    facts.push({ label: 'Avg. turnover', icon: <TrendingUp size={15} color="#00A572" />, value: pkr(company?.average_turnover) });
  }

  const aboutHtml =
    [company?.co_overview, company?.co_descp, company?.co_description].find(
      (v) => meaningfulText(v).length >= 3,
    ) ?? '';
  const aboutText = meaningfulText(aboutHtml);
  const aboutHasHtml = aboutHtml.includes('<');
  const aboutExceeds = aboutHasHtml || aboutText.length > 180;
  const visibleAbout = expanded || !aboutExceeds ? aboutText : `${aboutText.slice(0, 180).trimEnd()}…`;

  const contacts: any[] = (company?.company_contacts ?? []).filter(
    (c: any) => c?.con_p_name || c?.con_mobilenumber || c?.con_email,
  );
  const employees: any[] = (data?.companyEmp ?? []).filter(
    (e: any) => e?.u_firstname || e?.u_email || e?.a_position,
  );
  const hasContact =
    Boolean(company?.co_office_number) ||
    Boolean(company?.co_website_url) ||
    contacts.length > 0 ||
    employees.length > 0;

  const officePhone = company?.co_office_number ? String(company?.co_office_number) : '';
  const website = company?.co_website_url ? String(company?.co_website_url) : '';
  const isInstagram = website.includes('instagram.com');
  const websiteLabel = website
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '')
    .toLowerCase();
  const websiteShort = websiteLabel.length > 28 ? `${websiteLabel.slice(0, 28)}…` : websiteLabel;

  const openLink = (url: string) => Linking.openURL(url).catch(() => { });

  if (isLoading) {
    return (
      <MainLayout showHeader={false}>
        <View className="flex-1 bg-light">
          <Skeleton className="w-full h-[320px] rounded-none" />
          <View className="px-5 pt-6 pb-10">
            <Skeleton className="w-3/4 h-8 mb-3" />
            <Skeleton className="w-1/2 h-5 mb-6" />
            <Skeleton className="w-full h-28 rounded-2xl mb-6" />
            <Skeleton className="w-full h-28 rounded-2xl mb-6" />
            <Skeleton className="w-2/3 h-5 mb-3" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-5/6 h-4" />
          </View>
        </View>
      </MainLayout>
    );
  }

  if (isError || !company) {
    return (
      <MainLayout showHeader={false}>
        <View className="flex-1 items-center justify-center bg-light px-6">
          <Text className="text-neutral-500 text-center">Unable to load company details.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="outlined" className="mt-4" />
        </View>
      </MainLayout>
    );
  }



  return (
    <MainLayout showHeader={false}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Carousel
            images={heroImages}
            height={320}
            showDots={false}
            autoPlay={false}
            card={false}
            onItemPress={() => setGalleryVisible(true)}
            onIndexChange={setHeroIndex}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-3 top-3 z-50"
          >
            <View className="bg-black/30 rounded-full p-2.5">
              <ArrowLeft color="white" size={24} />
            </View>
          </TouchableOpacity>

          {heroImages.length > 0 && (
            <>
              <TouchableOpacity
                onPress={() => setGalleryVisible(true)}
                className="absolute right-3 top-3 z-50"
              >
                <View className="bg-black/30 rounded-full p-2.5 flex-row items-center gap-1.5">
                  <Images size={16} color="white" />
                  <Text className="text-white text-xs font-lato">{heroImages.length}</Text>
                </View>
              </TouchableOpacity>
              <View className="absolute bottom-4 right-3 bg-neutral-500/80 px-3 py-1 rounded-lg z-10">
                <Text className="text-white text-xs font-lato">
                  {heroIndex + 1} / {heroImages.length}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className='-mt-5 rounded-t-[2rem] bg-white px-4 pt-6 pb-8 z-10'>
          <View className="px-1">
            <Text className="text-[30px] leading-9 font-lato-black text-neutral-dark2">
              {name}
            </Text>
            {slogan && (
              <View className="flex-row items-center gap-2 mt-2">
                <View className="h-[3px] w-8 rounded-full bg-primary-700" />
                <Text className="text-primary-700 font-lato text-base flex-1">{slogan}</Text>
              </View>
            )}
            {locationFull && (
              <View className="flex-row items-center gap-1.5 mt-3">
                <MapPin size={15} color="#8990A8" />
                <Text className="text-neutral-600 font-lato text-sm">{locationFull}</Text>
              </View>
            )}
          </View>

          <View className="mt-5">
            <FinancialStatsCard
              totalInvestment={pkr(company.co_total_investment) || 'N/A'}
              franchiseFee={pkr(company.co_franchise_fee) || 'N/A'}
              royaltyFee={company.co_royalty_fee || 'N/A'}
              icons={[
                <DollarSign size={14} color="#436CF5" />,
                <FileText size={14} color="#E0409A" />,
                <Percent size={14} color="#26C289" />,
              ]}
            />
          </View>

          <FactGrid facts={facts} />

          {aboutText && (
            <View className="px-1 mt-6">
              <SectionTitle>About the Franchise</SectionTitle>
              {aboutHasHtml ? (
                <HTMLContentView html={aboutHtml} collapsed={!expanded} />
              ) : (
                <Text className="text-neutral-900 text-base font-lato leading-6">
                  {visibleAbout}
                </Text>
              )}
              {aboutExceeds && (
                <TouchableOpacity
                  onPress={() => setExpanded((prev) => !prev)}
                  className="flex-row items-center gap-1 mt-2 self-start"
                >
                  <Text className="text-primary-700 font-lato-bold">
                    {expanded ? 'See Less' : 'See More'}
                  </Text>
                  {expanded ? (
                    <ChevronUp size={16} color="#436CF5" />
                  ) : (
                    <ChevronDown size={16} color="#436CF5" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {videoUrl && (
            <TouchableOpacity
              onPress={() => openLink(videoUrl)}
              activeOpacity={0.9}
              className="relative mt-6 overflow-hidden rounded-2xl"
            >
              <Image
                source={{ uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
                className="w-full h-44"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/35 items-center justify-center">
                <View className="bg-white/95 rounded-full p-4">
                  <Play size={22} color="#0039B5" fill="#0039B5" />
                </View>
              </View>
              <View className="absolute bottom-3 left-3 bg-black/50 px-3 py-1.5 rounded-lg">
                <Text className="text-white font-lato-bold text-xs tracking-[0.12em]">WATCH PROMO</Text>
              </View>
            </TouchableOpacity>
          )}

          {hasContact && (
            <View className="px-1 mt-6">
              <SectionTitle>Get in Touch</SectionTitle>
              <View className="rounded-2xl border border-neutral-200 overflow-hidden">
                {officePhone && (
                  <TouchableOpacity
                    onPress={() => openLink(`tel:${officePhone.replace(/\s+/g, '')}`)}
                    className="flex-row items-center gap-3 px-4 py-3.5 border-b border-neutral-100"
                  >
                    <View className="w-9 h-9 rounded-full bg-secondary-200 items-center justify-center">
                      <Phone size={16} color="#436CF5" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] uppercase tracking-[0.12em] text-neutral-600 font-lato-bold">Office</Text>
                      <Text className="text-neutral-900 font-lato-bold text-sm">{officePhone}</Text>
                    </View>
                    <ChevronRight size={16} color="#A3ABC4" />
                  </TouchableOpacity>
                )}

                {website && (
                  <TouchableOpacity
                    onPress={() => openLink(website)}
                    className="flex-row items-center gap-3 px-4 py-3.5 border-b border-neutral-100"
                  >
                    <View className="w-9 h-9 rounded-full bg-secondary-200 items-center justify-center">
                      {isInstagram ? <Camera size={16} color="#436CF5" /> : <Globe size={16} color="#436CF5" />}
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] uppercase tracking-[0.12em] text-neutral-600 font-lato-bold">
                        {isInstagram ? 'Instagram' : 'Website'}
                      </Text>
                      <Text className="text-neutral-900 font-lato-bold text-sm" numberOfLines={1}>
                        {websiteShort}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#A3ABC4" />
                  </TouchableOpacity>
                )}

                {contacts.map((c: any) => (
                  <View key={c.con_id ?? c.con_p_name} className="px-4 py-3.5 border-b border-neutral-100">
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-full bg-secondary-200 items-center justify-center">
                        <User size={16} color="#436CF5" />
                      </View>
                      <View className="flex-1">
                        {c.con_p_name ? (
                          <Text className="text-neutral-900 font-lato-bold text-sm">{c.con_p_name}</Text>
                        ) : null}
                        {c.con_desgnation ? (
                          <Text className="text-neutral-600 text-xs font-lato">{c.con_desgnation}</Text>
                        ) : null}
                      </View>
                    </View>
                    {(c.con_mobilenumber || c.con_email) && (
                      <View className="mt-2.5 flex-row flex-wrap gap-2">
                        {c.con_mobilenumber && (
                          <TouchableOpacity
                            onPress={() => openLink(`tel:${String(c.con_mobilenumber).replace(/\s+/g, '')}`)}
                            className="flex-row items-center gap-1.5 bg-secondary-200 rounded-full px-3 py-1.5"
                          >
                            <Phone size={12} color="#436CF5" />
                            <Text className="text-primary-700 text-xs font-lato-bold">{c.con_mobilenumber}</Text>
                          </TouchableOpacity>
                        )}
                        {c.con_email && String(c.con_email).includes('@') ? (
                          <TouchableOpacity
                            onPress={() => openLink(`mailto:${c.con_email}`)}
                            className="flex-row items-center gap-1.5 bg-secondary-200 rounded-full px-3 py-1.5"
                          >
                            <Mail size={12} color="#436CF5" />
                            <Text className="text-primary-700 text-xs font-lato-bold">{c.con_email}</Text>
                          </TouchableOpacity>
                        ) : c.con_email ? (
                          <TouchableOpacity
                            onPress={() => openLink(String(c.con_email))}
                            className="flex-row items-center gap-1.5 bg-secondary-200 rounded-full px-3 py-1.5"
                          >
                            <Camera size={12} color="#436CF5" />
                            <Text className="text-primary-700 text-xs font-lato-bold">Social link</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {employees.map((e: any, idx: number) => {
                const avatar = imageUrl(e.u_image);
                const initials = [e.u_firstname, e.u_lastname]
                  .filter(Boolean)
                  .map((s: string) => String(s).charAt(0).toUpperCase())
                  .join('');
                return (
                  <View key={e.id ?? idx} className="flex-row items-center gap-3 mt-3 rounded-2xl border border-neutral-200 p-3">
                    {avatar ? (
                      <Image source={{ uri: avatar }} className="w-12 h-12 rounded-full" resizeMode="cover" />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-secondary-200 items-center justify-center">
                        <Text className="text-primary-700 font-lato-bold">{initials || '?'}</Text>
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-neutral-900 font-lato-bold text-sm">
                        {[e.u_firstname, e.u_lastname].filter(Boolean).join(' ') || 'Contact'}
                      </Text>
                      {e.a_position ? <Text className="text-neutral-600 text-xs font-lato">{e.a_position}</Text> : null}
                      {e.u_email ? <Text className="text-neutral-500 text-xs font-lato mt-0.5" numberOfLines={1}>{e.u_email}</Text> : null}
                    </View>
                    {e.u_contact && (
                      <TouchableOpacity
                        onPress={() => openLink(`tel:${String(e.u_contact).replace(/[^\d+]/g, '')}`)}
                        className="bg-secondary-200 rounded-full p-2.5"
                      >
                        <Phone size={16} color="#436CF5" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {data?.related && data.related.length > 0 && (
            <View className='mt-6'>
              <SectionTitle>Related Franchises</SectionTitle>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.related.map((item) => (
                  <Card
                    key={item.co_id}
                    title={item.co_name}
                    imageSource={getCompanyCoverImage(item)}
                    investmentRange={item.co_investment_range}
                    containerClassName='w-[250px] mr-3'
                    onPress={() => navigation.replace('CompanyDetail', { slug: item.co_slug })}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View className='bg-white flex items-end p-3 border-t-[0.8px] border-neutral-200'>
        <Button
          title='Submit request'
          className='w-fit py-3 px-4'
          onPress={() => setSheetVisible(true)}
          icon={<ChevronRight color="white" />}
          iconPosition='right'
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text className="text-xl font-lato-bold text-neutral-900 mb-2">Submit Request</Text>
        <Text className="text-neutral-600 mb-6">Fill in your details to submit a franchise inquiry request for {company.co_name}.</Text>
        <Button title="Submit" onPress={() => setSheetVisible(false)} />
      </BottomSheet>

      <BottomSheet visible={galleryVisible} onClose={() => setGalleryVisible(false)}>
        <Text className="text-xl font-lato-bold text-neutral-900 mb-3">Gallery</Text>
        {heroImages.map((img, i) => (
          <Image
            key={i}
            source={img}
            className="w-full h-56 rounded-xl mb-3"
            resizeMode="cover"
          />
        ))}
      </BottomSheet>
    </MainLayout>
  );
}
