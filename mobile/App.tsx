import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface MobileSignal {
  id: number;
  title: string;
  company: string;
  type: 'hiring_surge' | 'layoff' | 'expansion' | 'restructuring';
  headcount: number;
  city: string;
  country: string;
  summary: string;
  source: string;
  timeAgo: string;
}

const SAMPLE_MOBILE_SIGNALS: MobileSignal[] = [
  {
    id: 101,
    company: "NVIDIA",
    title: "NVIDIA Expands AI Hardware Campus in Austin with 2,200 Specialized Roles",
    type: "hiring_surge",
    headcount: 2200,
    city: "Austin, TX",
    country: "United States",
    summary: "NVIDIA announced a $1.2B capital expansion creating over 2,200 high-performance computing, silicon design, and AI infrastructure engineering positions.",
    source: "Reuters Tech",
    timeAgo: "3h ago",
  },
  {
    id: 102,
    company: "ASML",
    title: "ASML Inaugurates Semiconductor R&D Center in Dresden, Adding 1,400 Engineers",
    type: "expansion",
    headcount: 1400,
    city: "Dresden",
    country: "Germany",
    summary: "European lithography leader ASML partners with Saxony state government to build an advanced EUV research facility, adding 1,400 precision engineering jobs.",
    source: "Financial Times",
    timeAgo: "7h ago",
  },
  {
    id: 103,
    company: "BT Group",
    title: "BT Group Restructuring Legacy Operations, Impacting 4,800 Roles Across UK",
    type: "layoff",
    headcount: -4800,
    city: "London",
    country: "United Kingdom",
    summary: "Telecommunications conglomerate reveals multi-year digital transformation and legacy copper network phase-out, reducing operational workforce by 4,800 across London.",
    source: "Bloomberg Markets",
    timeAgo: "11h ago",
  },
  {
    id: 104,
    company: "Google DeepMind",
    title: "Google DeepMind Launches Frontier AI Research Hub in Singapore, Creating 650 Roles",
    type: "hiring_surge",
    headcount: 650,
    city: "Singapore",
    country: "Singapore",
    summary: "Google DeepMind accelerates Asia-Pacific research hub in Singapore, hiring 650 AI research scientists, machine learning systems engineers, and ethics researchers.",
    source: "The Straits Times",
    timeAgo: "14h ago",
  },
  {
    id: 105,
    company: "Tata Consultancy",
    title: "TCS To Onboard 18,000 Cloud & Cyber Engineers in Bengaluru Campus",
    type: "hiring_surge",
    headcount: 18000,
    city: "Bengaluru",
    country: "India",
    summary: "TCS announces massive recruitment drive targeting enterprise cloud architecture, generative AI solutions, and zero-trust cybersecurity operations in Bengaluru.",
    source: "Economic Times",
    timeAgo: "19h ago",
  },
  {
    id: 106,
    company: "Klarna",
    title: "Klarna Cuts 850 Customer Support Roles Following Autonomous AI Agent Rollout",
    type: "layoff",
    headcount: -850,
    city: "Dublin",
    country: "Ireland",
    summary: "Fintech giant streamlines dispute resolution and compliance onboarding via autonomous LLM agents, cutting 850 support roles primarily in Dublin and Stockholm.",
    source: "Wall Street Journal",
    timeAgo: "1d ago",
  },
  {
    id: 107,
    company: "TSMC",
    title: "TSMC Accelerates Kumamoto Fab 2 Construction, Opening 3,500 Advanced Fab Vacancies",
    type: "expansion",
    headcount: 3500,
    city: "Kumamoto",
    country: "Japan",
    summary: "Taiwan Semiconductor Manufacturing Co expands Japanese manufacturing presence with second advanced node fab, opening 3,500 semiconductor fabrication roles.",
    source: "Nikkei Asia",
    timeAgo: "1d ago",
  },
];

export default function App() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedSignal, setSelectedSignal] = useState<MobileSignal | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(true);

  const filteredSignals = SAMPLE_MOBILE_SIGNALS.filter((s) => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hiring_surge':
        return '#10b981';
      case 'layoff':
        return '#f43f5e';
      case 'expansion':
        return '#06b6d4';
      default:
        return '#f59e0b';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hiring_surge':
        return 'Hiring Surge';
      case 'layoff':
        return 'Layoff Alert';
      case 'expansion':
        return 'Expansion';
      default:
        return 'Restructuring';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top App Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.brandTitle}>
            Career<Text style={styles.brandAccent}>Signal</Text> 📡
          </Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE RADAR</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Real-Time Global Corporate Employment Intelligence
        </Text>
      </View>

      {/* Breaking Push Alert Banner */}
      {showNotification && (
        <TouchableOpacity 
          style={styles.alertBanner} 
          onPress={() => setSelectedSignal(SAMPLE_MOBILE_SIGNALS[1])}
        >
          <View style={styles.alertHeaderRow}>
            <Text style={styles.alertTag}>⚡ BREAKING DISPATCH</Text>
            <TouchableOpacity onPress={() => setShowNotification(false)}>
              <Text style={styles.alertDismiss}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.alertTitle}>ASML adds 1,400 Semiconductor Roles in Dresden</Text>
          <Text style={styles.alertSource}>Financial Times • Tap for full analysis</Text>
        </TouchableOpacity>
      )}

      {/* Summary KPI Strip */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Tracked Hires</Text>
          <Text style={[styles.kpiValue, { color: '#34d399' }]}>+25,750</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Tracked Cuts</Text>
          <Text style={[styles.kpiValue, { color: '#fb7185' }]}>-5,650</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Net Balance</Text>
          <Text style={[styles.kpiValue, { color: '#38bdf8' }]}>+20,100</Text>
        </View>
      </View>

      {/* Filter Segmented Control */}
      <View style={styles.filterRow}>
        {[
          { id: 'all', label: 'All Signals' },
          { id: 'hiring_surge', label: 'Hiring' },
          { id: 'layoff', label: 'Layoffs' },
          { id: 'expansion', label: 'Expansion' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              filter === tab.id && styles.filterTabActive,
            ]}
            onPress={() => setFilter(tab.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab.id && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Signals Feed List */}
      <FlatList
        data={filteredSignals}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const typeColor = getTypeColor(item.type);
          const isPositive = item.headcount > 0;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedSignal(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.companyInfoRow}>
                  <View style={styles.companyAvatar}>
                    <Text style={styles.companyAvatarText}>{item.company.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.companyName}>{item.company}</Text>
                    <Text style={styles.companyLocation}>{item.city}, {item.country}</Text>
                  </View>
                </View>

                <View style={[
                  styles.headcountPill,
                  { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)' }
                ]}>
                  <Text style={[
                    styles.headcountText,
                    { color: isPositive ? '#34d399' : '#fb7185' }
                  ]}>
                    {isPositive ? `+${item.headcount.toLocaleString()}` : item.headcount.toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.cardFooter}>
                <View style={[styles.typeBadge, { borderColor: `${typeColor}60`, backgroundColor: `${typeColor}15` }]}>
                  <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                    {getTypeLabel(item.type)}
                  </Text>
                </View>
                <Text style={styles.timeText}>{item.timeAgo} • {item.source}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Signal Detail Modal */}
      <Modal
        visible={!!selectedSignal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSignal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSignal && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalCompany}>{selectedSignal.company}</Text>
                    <Text style={styles.modalLocation}>{selectedSignal.city}, {selectedSignal.country}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedSignal(null)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalHeroPill}>
                  <Text style={styles.modalHeroLabel}>Reported Headcount Change</Text>
                  <Text style={[
                    styles.modalHeroValue,
                    { color: selectedSignal.headcount > 0 ? '#34d399' : '#fb7185' }
                  ]}>
                    {selectedSignal.headcount > 0
                      ? `+${selectedSignal.headcount.toLocaleString()} New Roles`
                      : `${selectedSignal.headcount.toLocaleString()} Cuts`}
                  </Text>
                </View>

                <Text style={styles.modalHeadline}>{selectedSignal.title}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>AI Executive Briefing</Text>
                  <Text style={styles.modalSectionBody}>{selectedSignal.summary}</Text>
                </View>

                <View style={styles.modalFooterRow}>
                  <Text style={styles.modalSourceText}>Source: {selectedSignal.source}</Text>
                  <Text style={styles.modalVerifiedText}>✓ Verified News Signal</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080c16',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  brandAccent: {
    color: '#38bdf8',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 5,
  },
  liveText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  alertBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: 12,
    padding: 12,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTag: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  alertDismiss: {
    color: '#94a3b8',
    fontSize: 12,
  },
  alertTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  alertSource: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  kpiContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
  },
  kpiDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  kpiLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  filterTabActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
  },
  filterTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#38bdf8',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyAvatarText: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 14,
  },
  companyName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  companyLocation: {
    color: '#64748b',
    fontSize: 11,
  },
  headcountPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  headcountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  typeBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timeText: {
    color: '#64748b',
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0c1220',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.3)',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalCompany: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  modalLocation: {
    color: '#94a3b8',
    fontSize: 12,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  modalHeroPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  modalHeroLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalHeroValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  modalHeadline: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 14,
  },
  modalSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  modalSectionTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSectionBody: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  modalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalSourceText: {
    color: '#64748b',
    fontSize: 11,
  },
  modalVerifiedText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
});
