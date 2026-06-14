import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── 1. Demo User (for conversation/saved resource features) ──────
  const demoUser = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      name: "Alex Korane",
      email: "alex@example.com",
      username: "alexkorane",
      plan: "free",
      language: "en",
      location: "Austin, TX",
    },
  });

  console.log("Demo user created:", demoUser.id);

  // ─── 2. Default UserSettings ───────────────────────────────────
  await prisma.userSettings.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
    },
  });

  console.log("Default settings created for demo user");

  // ─── 3. Community Resources (40+ across 8 categories) ─────────

  const resources = [
    // ── Housing Assistance (6) ──
    {
      name: "Austin Emergency Rental Assistance Program",
      category: "Housing Assistance",
      description: "Provides emergency rental assistance to low-income Austin residents facing eviction or housing instability. Funds can cover past-due rent, utilities, and security deposits.",
      phone: "(512) 974-3100",
      address: "1520 Rutherford Ln, Austin, TX 78754",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Must be an Austin resident, at or below 80% AMI, with a documented financial hardship",
      services: "Rental assistance, Utility assistance, Security deposit help, Eviction prevention",
      languages: "English, Spanish",
      lastVerified: "2025-12-15",
      url: "https://www.austintexas.gov/department/housing",
    },
    {
      name: "Section 8 Housing Choice Voucher Program",
      category: "Housing Assistance",
      description: "Federal housing assistance program that helps low-income families, the elderly, and disabled individuals afford safe and sanitary housing in the private market.",
      phone: "(512) 477-4488",
      address: "1014 Norwood Park Blvd, Austin, TX 78753",
      hours: "Mon-Fri 8am-4pm",
      eligibility: "Income must not exceed 50% of the median income for the metropolitan area",
      services: "Housing vouchers, Tenant counseling, Landlord mediation",
      languages: "English, Spanish, Vietnamese",
      lastVerified: "2025-11-20",
      url: "https://www.haca.org",
    },
    {
      name: "Austin Area Homeless Shelter — Salvation Army",
      category: "Housing Assistance",
      description: "Emergency shelter providing temporary housing for individuals and families experiencing homelessness. Includes meals, case management, and transition support services.",
      phone: "(512) 476-1111",
      address: "501 E 8th St, Austin, TX 78701",
      hours: "24/7 emergency intake",
      eligibility: "Open to all individuals and families experiencing homelessness",
      services: "Emergency shelter, Meals, Case management, Job referrals, Transitional housing",
      languages: "English, Spanish",
      lastVerified: "2025-10-30",
      url: "https://www.salvationarmyaustin.org",
    },
    {
      name: "Foundation Communities — Affordable Housing",
      category: "Housing Assistance",
      description: "Nonprofit providing affordable apartment communities with on-site support services including financial coaching, after-school programs, and health resources.",
      phone: "(512) 610-4000",
      address: "3000 S IH-35, Austin, TX 78704",
      hours: "Mon-Fri 9am-6pm",
      eligibility: "Income at or below 60% AMI; specific properties may vary",
      services: "Affordable apartments, Financial coaching, After-school programs, Health access",
      languages: "English, Spanish",
      lastVerified: "2026-01-05",
      url: "https://www.foundcom.org",
    },
    {
      name: "Travis County Emergency Housing Assistance",
      category: "Housing Assistance",
      description: "County-wide program providing short-term financial assistance for housing-related emergencies including mortgage delinquency, property tax relief, and home repairs for qualifying residents.",
      phone: "(512) 854-6000",
      address: "5501 Airport Blvd, Austin, TX 78751",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Travis County residents at or below 150% federal poverty level",
      services: "Mortgage assistance, Property tax relief, Emergency home repairs",
      languages: "English, Spanish",
      lastVerified: "2025-09-18",
      url: "https://www.traviscountytx.gov",
    },
    {
      name: "Caritas of Austin — Housing Stability",
      category: "Housing Assistance",
      description: "Provides housing stability services including rapid rehousing, permanent supportive housing, and homelessness prevention for vulnerable populations in Austin.",
      phone: "(512) 479-4616",
      address: "611 Neches St, Austin, TX 78701",
      hours: "Mon-Fri 8:30am-5pm",
      eligibility: "Individuals and families experiencing or at risk of homelessness",
      services: "Rapid rehousing, Permanent supportive housing, Homelessness prevention, Case management",
      languages: "English, Spanish",
      lastVerified: "2026-01-12",
      url: "https://www.caritasofaustin.org",
    },

    // ── Food Assistance (6) ──
    {
      name: "Texas SNAP (Supplemental Nutrition Assistance Program)",
      category: "Food Assistance",
      description: "Federal nutrition assistance program providing monthly benefits on an EBT card to help low-income individuals and families purchase food. Apply online, by phone, or in person.",
      phone: "1-877-541-7905",
      address: "Texas Health and Human Services, 1100 W 49th St, Austin, TX 78756",
      hours: "Mon-Fri 8am-5pm; Online 24/7",
      eligibility: "Must meet income and resource limits; Texas residents",
      services: "Monthly food benefits, Nutrition education, Employment & training referrals",
      languages: "English, Spanish, Multiple languages available",
      lastVerified: "2026-02-01",
      url: "https://www.yourtexasbenefits.com",
    },
    {
      name: "Central Texas Food Bank",
      category: "Food Assistance",
      description: "Largest hunger-relief charity in Central Texas, distributing millions of meals annually through a network of partner agencies, mobile pantries, and direct distribution programs.",
      phone: "(512) 282-2111",
      address: "6500 Metropolis Dr, Austin, TX 78744",
      hours: "Mon-Fri 8am-5pm; Mobile pantry schedules vary",
      eligibility: "Open to anyone in need; no documentation required for emergency food",
      services: "Food distribution, Mobile pantry, SNAP application assistance, Nutrition programs",
      languages: "English, Spanish",
      lastVerified: "2025-12-20",
      url: "https://www.centraltexasfoodbank.org",
    },
    {
      name: "WIC (Women, Infants, and Children) — Austin",
      category: "Food Assistance",
      description: "Federal nutrition program for pregnant women, new mothers, infants, and children under 5. Provides healthy food, nutrition counseling, breastfeeding support, and healthcare referrals.",
      phone: "(512) 972-5757",
      address: "15 Waller St, Austin, TX 78702",
      hours: "Mon-Fri 7:30am-5pm",
      eligibility: "Pregnant, postpartum, or breastfeeding women; infants and children under 5; income at or below 185% FPL",
      services: "Healthy food packages, Nutrition counseling, Breastfeeding support, Healthcare referrals",
      languages: "English, Spanish",
      lastVerified: "2026-01-15",
      url: "https://www.texaswic.org",
    },
    {
      name: "Austin ISD Free School Meals",
      category: "Food Assistance",
      description: "All Austin ISD students receive free breakfast and lunch at school regardless of family income. Summer meal programs are also available at designated sites across the district.",
      phone: "(512) 414-0251",
      address: "1111 W 6th St, Austin, TX 78703",
      hours: "School days: Breakfast 7-8am, Lunch 11am-1pm; Summer: varies by site",
      eligibility: "All enrolled AISD students; Community members 18 and under during summer",
      services: "Free breakfast, Free lunch, Summer meal program, After-school snacks",
      languages: "English, Spanish",
      lastVerified: "2025-08-25",
      url: "https://www.austinisd.org/nutrition",
    },
    {
      name: "Meals on Wheels Central Texas",
      category: "Food Assistance",
      description: "Delivers hot, nutritious meals to homebound seniors and individuals with disabilities who cannot prepare their own meals. Also provides pet food and friendly visiting programs.",
      phone: "(512) 476-6325",
      address: "3227 E 5th St, Austin, TX 78702",
      hours: "Mon-Fri 8am-5pm; Delivery: Mon-Fri 10am-2pm",
      eligibility: "Homebound individuals 60+ or adults with disabilities unable to prepare meals",
      services: "Home-delivered meals, Pet food program, Friendly visits, Nutrition counseling",
      languages: "English, Spanish",
      lastVerified: "2026-01-10",
      url: "https://www.mealsonwheelscentex.org",
    },
    {
      name: "St. John Community Food Pantry",
      category: "Food Assistance",
      description: "Community-based food pantry providing groceries, fresh produce, and personal care items to families and individuals in the St. John neighborhood and surrounding areas.",
      phone: "(512) 837-6725",
      address: "901 E St. Johns Ave, Austin, TX 78752",
      hours: "Tue & Thu 9am-12pm; Sat 10am-1pm",
      eligibility: "Open to anyone in need; ID and proof of address requested but not required",
      services: "Grocery distribution, Fresh produce, Personal care items, Holiday meal baskets",
      languages: "English, Spanish",
      lastVerified: "2025-11-08",
      url: "",
    },

    // ── Mental Health (6) ──
    {
      name: "Austin Public Health — Community Counseling Centers",
      category: "Mental Health",
      description: "City-funded counseling centers providing affordable individual and group therapy, psychiatric evaluation, and medication management on a sliding fee scale.",
      phone: "(512) 972-5759",
      address: "15 Waller St, Austin, TX 78702",
      hours: "Mon-Fri 8am-5pm; Evening hours by appointment",
      eligibility: "Austin/Travis County residents; sliding fee scale based on income",
      services: "Individual therapy, Group therapy, Psychiatric evaluation, Medication management, Crisis intervention",
      languages: "English, Spanish",
      lastVerified: "2026-02-05",
      url: "https://www.austintexas.gov/department/mental-health",
    },
    {
      name: "988 Suicide & Crisis Lifeline",
      category: "Mental Health",
      description: "National suicide prevention and crisis support lifeline providing free, confidential 24/7 support for people in suicidal crisis or emotional distress. Call or text 988.",
      phone: "988",
      address: "National — available everywhere",
      hours: "24/7/365",
      eligibility: "Anyone in emotional distress or suicidal crisis",
      services: "Crisis counseling, Emotional support, Referral to local resources, Spanish line available",
      languages: "English, Spanish, 200+ languages via interpreters",
      lastVerified: "2026-03-01",
      url: "https://988lifeline.org",
    },
    {
      name: "Integral Care — Crisis & Behavioral Health",
      category: "Mental Health",
      description: "Travis County's authority for behavioral health and intellectual disability services. Provides 24/7 crisis hotline, mobile crisis outreach, and outpatient mental health treatment.",
      phone: "(512) 472-4357",
      address: "4900 Mueller Blvd, Austin, TX 78723",
      hours: "Crisis line: 24/7; Office: Mon-Fri 8am-5pm",
      eligibility: "Travis County residents; priority for uninsured and low-income individuals",
      services: "24/7 crisis hotline, Mobile crisis team, Outpatient therapy, Psychiatric services, Substance use treatment",
      languages: "English, Spanish",
      lastVerified: "2025-12-22",
      url: "https://www.integralcare.org",
    },
    {
      name: "NAMI Central Texas — Support Groups",
      category: "Mental Health",
      description: "National Alliance on Mental Illness Central Texas chapter offering free peer-led support groups, family education programs, and mental health advocacy for individuals and families affected by mental illness.",
      phone: "(512) 420-9810",
      address: "11500 Metric Blvd, Suite 180, Austin, TX 78758",
      hours: "Office: Mon-Fri 9am-5pm; Groups: evenings and weekends",
      eligibility: "Free and open to anyone affected by mental health conditions",
      services: "Peer support groups, Family-to-Family education, Mental health presentations, HelpLine",
      languages: "English, Spanish",
      lastVerified: "2026-01-20",
      url: "https://www.namicentraltx.org",
    },
    {
      name: "Crisis Text Line",
      category: "Mental Health",
      description: "Free, confidential text-based crisis support available 24/7. Text HOME to 741741 to connect with a trained crisis counselor for any type of crisis or emotional distress.",
      phone: "Text HOME to 741741",
      address: "National — text-based service",
      hours: "24/7/365",
      eligibility: "Anyone in crisis or emotional distress",
      services: "Text-based crisis counseling, Active listening, Safety planning, Referrals",
      languages: "English, Spanish",
      lastVerified: "2026-02-28",
      url: "https://www.crisistextline.org",
    },
    {
      name: "Austin State Hospital — Psychiatric Emergency",
      category: "Mental Health",
      description: "State psychiatric hospital providing inpatient psychiatric treatment for adults, children, and adolescents experiencing acute mental health crises. Accepts voluntary and involuntary admissions.",
      phone: "(512) 419-2600",
      address: "4110 Guadalupe St, Austin, TX 78751",
      hours: "24/7 admissions",
      eligibility: "Individuals in psychiatric crisis; admission via emergency referral or court order",
      services: "Inpatient psychiatric care, Emergency evaluation, Discharge planning, Outpatient referral",
      languages: "English, Spanish, Interpreter services available",
      lastVerified: "2025-11-30",
      url: "https://www.hhs.texas.gov",
    },

    // ── Employment Services (6) ──
    {
      name: "Workforce Solutions Capital Area",
      category: "Employment Services",
      description: "Austin's workforce development board providing job search assistance, career training, resume help, interview preparation, and connections to employers hiring now.",
      phone: "(512) 591-7200",
      address: "500 E 4th St, Austin, TX 78701",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Open to all job seekers in the Capital Area; some training programs have income requirements",
      services: "Job search assistance, Career counseling, Skills training, Resume workshops, Job fairs",
      languages: "English, Spanish",
      lastVerified: "2026-01-08",
      url: "https://www.wfscapitalarea.com",
    },
    {
      name: "Job Corps — Texas Centers",
      category: "Employment Services",
      description: "Federal career training program for young adults aged 16-24 providing free education, vocational training, housing, meals, and a living allowance while completing the program.",
      phone: "1-800-733-5627",
      address: "Multiple Texas locations; Nearest: 1509 W Ben White Blvd, Austin, TX 78704",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Ages 16-24, low-income, US citizen or legal resident",
      services: "Vocational training, GED/High school diploma, Housing, Meals, Job placement assistance",
      languages: "English, Spanish",
      lastVerified: "2025-10-15",
      url: "https://www.jobcorps.gov",
    },
    {
      name: "Goodwill Central Texas — Career & Job Center",
      category: "Employment Services",
      description: "Provides free career services including job readiness training, computer skills, career coaching, and direct connections to local employers. Also operates retail stores employing community members.",
      phone: "(512) 637-7180",
      address: "1015 Norwood Park Blvd, Austin, TX 78753",
      hours: "Mon-Fri 9am-5pm",
      eligibility: "Open to all job seekers; specialized programs for veterans, formerly incarcerated, and persons with disabilities",
      services: "Career coaching, Job readiness training, Computer literacy, Resume help, Employer connections",
      languages: "English, Spanish",
      lastVerified: "2025-12-10",
      url: "https://www.goodwillcentraltexas.org",
    },
    {
      name: "Texas Workforce Commission — Employment Services",
      category: "Employment Services",
      description: "State agency providing comprehensive employment services including job matching, unemployment benefits, workforce training grants, and career exploration tools.",
      phone: "1-800-939-6631",
      address: "101 E 15th St, Austin, TX 78778",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Texas residents; specific programs may have additional requirements",
      services: "Unemployment benefits, Job matching, Training grants, Career exploration, Veterans' services",
      languages: "English, Spanish",
      lastVerified: "2026-02-15",
      url: "https://www.twc.texas.gov",
    },
    {
      name: "American YouthWorks — Career Pathways",
      category: "Employment Services",
      description: "Nonprofit providing young adults (17-24) with career pathway programs in green jobs, healthcare, and technology. Includes paid training, certifications, and job placement support.",
      phone: "(512) 744-1900",
      address: "1901 E Ben White Blvd, Austin, TX 78741",
      hours: "Mon-Fri 9am-5pm",
      eligibility: "Young adults ages 17-24; some programs for adults 25+",
      services: "Paid job training, Industry certifications, GED preparation, Job placement, Supportive services",
      languages: "English, Spanish",
      lastVerified: "2025-09-25",
      url: "https://www.americanyouthworks.org",
    },
    {
      name: "SkillsFund — Upskilling & Micro-credentialing",
      category: "Employment Services",
      description: "Provides low-cost and free micro-credential programs in high-demand fields like IT, healthcare, and skilled trades. Partners with local employers for direct hiring pipelines.",
      phone: "(512) 394-9180",
      address: "Online + Austin locations",
      hours: "Flexible schedules; self-paced online options",
      eligibility: "Adults 18+ seeking career advancement or change",
      services: "Micro-credentials, IT certifications, Healthcare training, Job placement partnerships",
      languages: "English, Spanish",
      lastVerified: "2026-01-30",
      url: "",
    },

    // ── Legal Aid (6) ──
    {
      name: "Legal Aid Society of Central Texas",
      category: "Legal Aid",
      description: "Nonprofit law firm providing free civil legal representation to low-income residents in matters including housing, family law, public benefits, and consumer protection.",
      phone: "(512) 476-1188",
      address: "201 W 13th St, Austin, TX 78701",
      hours: "Mon-Fri 9am-5pm; Intake hotline: Mon-Fri 9am-12pm",
      eligibility: "Travis County residents at or below 200% federal poverty level",
      services: "Housing law, Family law, Public benefits, Consumer protection, Immigration assistance",
      languages: "English, Spanish",
      lastVerified: "2026-01-25",
      url: "https://www.lastx.org",
    },
    {
      name: "American Gateways — Immigration Legal Services",
      category: "Legal Aid",
      description: "Provides affordable and free immigration legal services including asylum representation, DACA renewals, citizenship applications, and deportation defense for Central Texas immigrants.",
      phone: "(512) 478-0546",
      address: "2200 E MLK Jr Blvd, Austin, TX 78702",
      hours: "Mon-Fri 9am-5pm",
      eligibility: "Low-income immigrants in Central Texas; fees on a sliding scale",
      services: "Asylum representation, DACA renewals, Citizenship applications, Deportation defense, Know Your Rights workshops",
      languages: "English, Spanish, French, Arabic",
      lastVerified: "2025-12-30",
      url: "https://www.americangateways.org",
    },
    {
      name: "Texas Legal Services Center",
      category: "Legal Aid",
      description: "Statewide nonprofit providing free legal assistance on civil matters through hotlines and direct representation, with expertise in housing, healthcare, and disaster recovery.",
      phone: "1-800-622-2520",
      address: "1414 W Ben White Blvd, Suite 200, Austin, TX 78704",
      hours: "Hotline: Mon-Fri 8:30am-4:30pm",
      eligibility: "Low-income Texans; varies by program",
      services: "Legal hotline, Housing advocacy, Healthcare access, Disaster legal aid, Veterans legal help",
      languages: "English, Spanish",
      lastVerified: "2026-02-10",
      url: "https://www.tlsc.org",
    },
    {
      name: "Travis County Law Library & Self-Help Center",
      category: "Legal Aid",
      description: "Free legal resource center providing access to legal forms, research materials, and self-representation guidance for individuals handling civil legal matters without an attorney.",
      phone: "(512) 854-8677",
      address: "500 W 10th St, Austin, TX 78701",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Open to all Travis County residents; no income requirements",
      services: "Legal forms, Research assistance, Self-help clinics, Notary services, Court navigation",
      languages: "English, Spanish",
      lastVerified: "2025-11-05",
      url: "https://www.traviscountytx.gov/law-library",
    },
    {
      name: "Family Violence Prevention Services — Legal Aid",
      category: "Legal Aid",
      description: "Provides legal representation and advocacy for survivors of domestic violence, sexual assault, and stalking, including protective orders, custody matters, and safety planning.",
      phone: "(512) 267-7233",
      address: "P.O. Box 161270, Austin, TX 78716",
      hours: "24/7 crisis line; Office: Mon-Fri 9am-5pm",
      eligibility: "Survivors of domestic violence, sexual assault, or stalking",
      services: "Protective orders, Custody representation, Safety planning, Court accompaniment, Legal advocacy",
      languages: "English, Spanish",
      lastVerified: "2026-02-20",
      url: "https://www.safeaustin.org",
    },
    {
      name: "Disability Rights Texas",
      category: "Legal Aid",
      description: "Federal protection and advocacy organization providing free legal services to Texans with disabilities, addressing discrimination, abuse, and access to services and benefits.",
      phone: "1-800-252-9108",
      address: "2222 W Braker Ln, Austin, TX 78758",
      hours: "Mon-Fri 9am-5pm; Intake: Mon-Fri 9am-12pm & 1pm-4pm",
      eligibility: "Texans with disabilities; no income requirements for most services",
      services: "Disability rights advocacy, Special education, Accessibility complaints, Vocational rehabilitation, Benefits assistance",
      languages: "English, Spanish, ASL",
      lastVerified: "2025-10-01",
      url: "https://www.disabilityrightstx.org",
    },

    // ── Healthcare (6) ──
    {
      name: "CommUnityCare Health Centers",
      category: "Healthcare",
      description: "Federally qualified health center network providing comprehensive primary care, dental, behavioral health, and pharmacy services on a sliding fee scale regardless of insurance status.",
      phone: "(512) 978-9015",
      address: "1500 E 4th St, Austin, TX 78702 (multiple locations)",
      hours: "Mon-Fri 8am-5pm; Some locations open evenings & Saturdays",
      eligibility: "Open to all; sliding fee scale based on income for uninsured patients",
      services: "Primary care, Dental, Behavioral health, Pharmacy, Lab services, Women's health",
      languages: "English, Spanish, Vietnamese",
      lastVerified: "2026-01-18",
      url: "https://www.communitycaretx.org",
    },
    {
      name: "Medicaid — Texas Health and Human Services",
      category: "Healthcare",
      description: "State and federal health insurance program for low-income individuals and families, pregnant women, children, seniors, and people with disabilities. Covers doctor visits, hospital stays, prescriptions, and more.",
      phone: "1-877-541-7905",
      address: "Apply online or at any HHSC office",
      hours: "Apply online 24/7; Office: Mon-Fri 8am-5pm",
      eligibility: "Based on income, family size, age, disability, and pregnancy status",
      services: "Doctor visits, Hospital care, Prescriptions, Preventive care, Mental health services, Long-term care",
      languages: "English, Spanish, Multiple languages",
      lastVerified: "2026-03-01",
      url: "https://www.yourtexasbenefits.com",
    },
    {
      name: "Patient Assistance Programs — Prescription Help",
      category: "Healthcare",
      description: "Pharmaceutical company programs providing free or low-cost prescription medications to uninsured and underinsured individuals. Many major medications are available through these programs.",
      phone: "1-888-477-2669",
      address: "Apply online or through healthcare provider",
      hours: "Applications processed Mon-Fri; Online 24/7",
      eligibility: "Uninsured or underinsured; income typically at or below 300% FPL; varies by program",
      services: "Free medications, Discount drug cards, Copay assistance, Medicare Part D assistance",
      languages: "English, Spanish",
      lastVerified: "2025-12-05",
      url: "https://www.pparx.org",
    },
    {
      name: "Planned Parenthood — Austin Health Centers",
      category: "Healthcare",
      description: "Reproductive healthcare provider offering affordable services including annual exams, birth control, STI testing and treatment, cancer screenings, and pregnancy-related care.",
      phone: "(512) 276-1200",
      address: "1823 E 7th St, Austin, TX 78702 (multiple locations)",
      hours: "Mon-Sat; Hours vary by location",
      eligibility: "Open to all; accepts insurance and offers sliding scale for uninsured",
      services: "Annual exams, Birth control, STI testing, Cancer screenings, Pregnancy testing, Hormone therapy",
      languages: "English, Spanish",
      lastVerified: "2026-01-22",
      url: "https://www.plannedparenthood.org",
    },
    {
      name: "Volunteer Healthcare Clinic — Free Medical Care",
      category: "Healthcare",
      description: "Free clinic providing primary healthcare, chronic disease management, and specialty referrals for uninsured adults in the Austin area. Staffed by volunteer healthcare professionals.",
      phone: "(512) 459-6001",
      address: "3211 E 6th St, Austin, TX 78702",
      hours: "Mon-Thu 5pm-9pm; Sat 9am-1pm",
      eligibility: "Uninsured adults 18+ living in the Austin metro area",
      services: "Primary care, Chronic disease management, Specialty referrals, Health screenings, Medication assistance",
      languages: "English, Spanish",
      lastVerified: "2025-11-12",
      url: "https://www.volunteerhealthcareclinic.org",
    },
    {
      name: "Maplewood Dental Clinic — Low-Cost Dental",
      category: "Healthcare",
      description: "Community dental clinic providing affordable dental services including cleanings, fillings, extractions, and dentures on a sliding fee scale for low-income patients.",
      phone: "(512) 978-9170",
      address: "1500 E 4th St, Austin, TX 78702",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Low-income adults; sliding fee scale; accepts Medicaid",
      services: "Cleanings, Fillings, Extractions, Dentures, Emergency dental care",
      languages: "English, Spanish",
      lastVerified: "2025-10-20",
      url: "",
    },

    // ── Substance Abuse (6) ──
    {
      name: "SAMHSA National Helpline",
      category: "Substance Abuse",
      description: "Free, confidential 24/7 treatment referral and information service for individuals and families facing mental health and/or substance use disorders. Available in English and Spanish.",
      phone: "1-800-662-4357",
      address: "National — phone and online service",
      hours: "24/7/365",
      eligibility: "Open to anyone seeking substance use treatment information or referrals",
      services: "Treatment referrals, Information, Support, Local resource connections, Crisis intervention",
      languages: "English, Spanish, 200+ languages via interpreters",
      lastVerified: "2026-02-01",
      url: "https://www.samhsa.gov/find-help/national-helpline",
    },
    {
      name: "Austin Recovery — Rehab & Detox",
      category: "Substance Abuse",
      description: "Nonprofit providing comprehensive substance use treatment including medical detoxification, residential treatment, outpatient programs, and aftercare support for adults and adolescents.",
      phone: "(512) 697-8600",
      address: "8402 Cross Park Dr, Austin, TX 78754",
      hours: "Admissions: Mon-Fri 8am-5pm; Programs: 24/7 residential",
      eligibility: "Adults and adolescents with substance use disorders; sliding fee scale available",
      services: "Medical detox, Residential treatment, Outpatient programs, Aftercare, Family program",
      languages: "English, Spanish",
      lastVerified: "2025-12-18",
      url: "https://www.austinrecovery.org",
    },
    {
      name: "Cenikor Foundation — Austin Outpatient",
      category: "Substance Abuse",
      description: "Nonprofit substance use treatment provider offering evidence-based outpatient services including individual and group counseling, relapse prevention, and medication-assisted treatment.",
      phone: "(512) 454-9200",
      address: "7701 N Lamar Blvd, Suite 300, Austin, TX 78752",
      hours: "Mon-Fri 8am-7pm; Saturday 9am-1pm",
      eligibility: "Adults 18+ with substance use disorders; accepts Medicaid and some insurance",
      services: "Outpatient counseling, MAT (Suboxone), Relapse prevention, DUI classes, Peer support",
      languages: "English, Spanish",
      lastVerified: "2026-01-05",
      url: "https://www.cenikor.org",
    },
    {
      name: "Alcoholics Anonymous — Austin Intergroup",
      category: "Substance Abuse",
      description: "Fellowship of individuals sharing their experience, strength, and hope to solve their common problem with alcohol. Hundreds of free meetings weekly across the Austin area.",
      phone: "(512) 444-0071",
      address: "1000 S 1st St, Austin, TX 78704 (meeting locations vary)",
      hours: "Meetings available every day, morning through evening",
      eligibility: "Anyone who wants to stop drinking; no fees or requirements",
      services: "AA meetings, Sponsorship, 12-step program, Online meetings, Literature",
      languages: "English, Spanish, ASL meetings available",
      lastVerified: "2026-02-25",
      url: "https://www.austinaa.org",
    },
    {
      name: "Narcotics Anonymous — Austin Area",
      category: "Substance Abuse",
      description: "Nonprofit fellowship of recovering addicts who meet regularly to help each other stay clean. Free meetings available daily throughout the Austin metropolitan area.",
      phone: "(512) 480-0006",
      address: "Various meeting locations throughout Austin",
      hours: "Meetings daily; see website for schedule",
      eligibility: "Anyone who wants to stop using drugs; completely free",
      services: "NA meetings, Sponsorship, 12-step recovery, Online meetings, Helpline",
      languages: "English, Spanish",
      lastVerified: "2025-11-28",
      url: "https://www.austinna.org",
    },
    {
      name: "The Sobering Center — Austin",
      category: "Substance Abuse",
      description: "Safe, short-term facility providing a supervised environment for public intoxication cases as an alternative to jail. Offers connections to treatment, housing, and other social services.",
      phone: "(512) 972-6800",
      address: "1213 Sabine St, Austin, TX 78701",
      hours: "24/7/365",
      eligibility: "Adults 18+ who are publicly intoxicated and do not require emergency medical care",
      services: "Safe sobering environment, Case management, Treatment referrals, Housing assistance, Transportation",
      languages: "English, Spanish",
      lastVerified: "2025-09-30",
      url: "https://www.soberingcenter.org",
    },

    // ── Senior Services (6) ──
    {
      name: "Meals on Wheels Central Texas",
      category: "Senior Services",
      description: "Delivers hot, nutritious meals to homebound seniors and individuals with disabilities. Also provides wellness checks, pet food assistance, and friendly visiting programs.",
      phone: "(512) 476-6325",
      address: "3227 E 5th St, Austin, TX 78702",
      hours: "Mon-Fri 8am-5pm; Delivery: Mon-Fri 10am-2pm",
      eligibility: "Homebound adults 60+ or individuals with disabilities unable to prepare meals",
      services: "Home-delivered meals, Wellness checks, Pet food program, Friendly visits, Emergency meal packs",
      languages: "English, Spanish",
      lastVerified: "2026-01-10",
      url: "https://www.mealsonwheelscentex.org",
    },
    {
      name: "Medicare Counseling — Benefits Checkup",
      category: "Senior Services",
      description: "Free Medicare counseling through the State Health Insurance Assistance Program (SHIP) helping seniors understand their coverage options, compare plans, and resolve billing issues.",
      phone: "1-800-252-9240",
      address: "Available statewide; local office: 1010 Lavaca St, Austin, TX 78701",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Medicare beneficiaries, their families, and caregivers",
      services: "Medicare plan comparison, Prescription drug coverage, Billing disputes, Enrollment assistance, Long-term care insurance",
      languages: "English, Spanish",
      lastVerified: "2026-02-12",
      url: "https://www.benefitscheckup.org",
    },
    {
      name: "Austin Senior Activity Centers",
      category: "Senior Services",
      description: "City-operated senior centers offering social activities, fitness classes, educational programs, nutritional lunches, health screenings, and transportation assistance for adults 60 and older.",
      phone: "(512) 974-7800",
      address: "Multiple locations including South Austin, North Austin, and East Austin",
      hours: "Mon-Fri 8am-5pm; Some weekend activities",
      eligibility: "Adults 60+; some programs available for adults 50+",
      services: "Social activities, Fitness classes, Nutritional lunches, Health screenings, Transportation, Educational programs",
      languages: "English, Spanish",
      lastVerified: "2025-12-15",
      url: "https://www.austintexas.gov/department/senior-services",
    },
    {
      name: "AARP Texas — Senior Advocacy & Resources",
      category: "Senior Services",
      description: "Advocacy organization providing resources, discounts, and community engagement opportunities for adults 50+. Offers fraud prevention, tax assistance, and healthcare navigation support.",
      phone: "1-866-295-7276",
      address: "98 San Jacinto Blvd, Suite 500, Austin, TX 78701",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Adults 50+; membership available but not required for most services",
      services: "Fraud prevention, Tax assistance, Healthcare navigation, Community events, Driver safety courses",
      languages: "English, Spanish",
      lastVerified: "2026-01-28",
      url: "https://www.aarp.org/tx",
    },
    {
      name: "Area Agency on Aging — Capital Area",
      category: "Senior Services",
      description: "Regional agency coordinating services for older adults including in-home care, caregiver support, legal assistance, ombudsman services, and information and referral.",
      phone: "(512) 916-6062",
      address: "1010 Lavaca St, Austin, TX 78701",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Adults 60+ and their caregivers in the Capital Area region",
      services: "In-home care, Caregiver support, Legal assistance, Ombudsman, Information & referral, Benefits counseling",
      languages: "English, Spanish",
      lastVerified: "2025-11-20",
      url: "https://www.capcog.org/aging",
    },
    {
      name: "Family Eldercare — Guardianship & Support",
      category: "Senior Services",
      description: "Nonprofit providing guardianship, money management, and housing services for elderly and disabled adults who are unable to manage their own affairs and have no family support.",
      phone: "(512) 459-4362",
      address: "1700 W Parmer Ln, Suite 120, Austin, TX 78727",
      hours: "Mon-Fri 8am-5pm",
      eligibility: "Elderly or disabled adults in need of guardianship or money management; Travis County",
      services: "Guardianship, Money management, Housing assistance, Case management, Long-term care ombudsman",
      languages: "English, Spanish",
      lastVerified: "2025-10-08",
      url: "https://www.familyeldercare.org",
    },
  ];

  console.log(`Creating ${resources.length} community resources...`);

  // Clear existing resources first to avoid duplicates
  await prisma.resource.deleteMany({});

  for (const resource of resources) {
    await prisma.resource.create({ data: resource });
  }

  console.log(`Created ${resources.length} community resources`);

  // ─── 4. Demo Conversations (5) ────────────────────────────────
  // Clear existing demo conversations for this user
  const existingConvs = await prisma.conversation.findMany({
    where: { userId: demoUser.id },
    select: { id: true },
  });
  if (existingConvs.length > 0) {
    await prisma.message.deleteMany({
      where: { conversationId: { in: existingConvs.map(c => c.id) } },
    });
  }
  await prisma.conversation.deleteMany({
    where: { userId: demoUser.id },
  });

  // Conversation 1: "I lost my job and can't pay rent"
  const conv1 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Lost job and can't pay rent",
      preview: "I lost my job and can't pay rent — need help with housing, food, and employment",
      category: "Housing Assistance",
      categoryColor: "#f59e0b",
      confidence: 78,
      isCrisis: false,
      isGuest: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        role: "user",
        text: "I lost my job and can't pay rent. I'm worried about getting evicted and I don't know where to turn. I also have kids to feed.",
      },
      {
        conversationId: conv1.id,
        role: "ai",
        text: "I understand this is a very stressful situation. Based on what you've shared, I've identified several areas where you can get help right away:\n\n🏠 **Housing Assistance (78% confidence)** — Emergency rental assistance programs can help cover past-due rent and prevent eviction.\n🍎 **Food Assistance (85% confidence)** — SNAP and local food banks can ensure your kids don't go hungry.\n💼 **Employment Services (71% confidence)** — Workforce development centers offer job search help, resume assistance, and training programs.",
        category: "Housing Assistance",
        confidence: 78,
        isCrisis: false,
        resources: JSON.stringify([
          { title: "Austin Emergency Rental Assistance Program", phone: "(512) 974-3100", action: "Call to apply for emergency rent help" },
          { title: "Central Texas Food Bank", phone: "(512) 282-2111", action: "Visit for emergency food assistance" },
          { title: "Workforce Solutions Capital Area", phone: "(512) 591-7200", action: "Get job search help and training" },
        ]),
        why: "Your mention of job loss and rent trouble strongly indicates housing and employment needs. With kids to feed, food assistance is the highest-priority match.",
        also: "You may also qualify for utility assistance programs and Medicaid for your children.",
        warning: null,
      },
      {
        conversationId: conv1.id,
        role: "user",
        text: "Thank you. How quickly can I get rental assistance? My landlord already gave me a notice.",
      },
      {
        conversationId: conv1.id,
        role: "ai",
        text: "Given that you already have a notice from your landlord, here's what I recommend:\n\n⚡ **Act quickly** — Call the Austin Emergency Rental Assistance Program at **(512) 974-3100** as soon as possible. They can sometimes expedite cases where eviction is imminent.\n📋 **Gather documents** — You'll need your lease, the eviction notice, proof of income loss, and ID.\n🏠 **Legal protection** — The Legal Aid Society of Central Texas **(512) 476-1188** can provide free legal help if your landlord proceeds with eviction.\n\nIn Austin, tenants have specific rights during the eviction process, and an attorney can help you understand those protections.",
        category: "Housing Assistance",
        confidence: 85,
        isCrisis: false,
        resources: JSON.stringify([
          { title: "Legal Aid Society of Central Texas", phone: "(512) 476-1188", action: "Free legal help for eviction cases" },
          { title: "Austin Emergency Rental Assistance Program", phone: "(512) 974-3100", action: "Apply for emergency rental help" },
        ]),
        why: "With an active eviction notice, legal assistance becomes critical alongside rental help.",
        also: "You may want to also contact Caritas of Austin for additional housing stability support.",
        warning: "Eviction timelines can move quickly — please call these resources today.",
      },
    ],
  });

  // Conversation 2: "I need help with my mental health"
  const conv2 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Mental health support needed",
      preview: "I need help with my mental health — feeling overwhelmed and anxious",
      category: "Mental Health",
      categoryColor: "#8b5cf6",
      confidence: 91,
      isCrisis: false,
      isGuest: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        role: "user",
        text: "I need help with my mental health. I've been feeling really overwhelmed and anxious for the past few months. I can barely get out of bed some days.",
      },
      {
        conversationId: conv2.id,
        role: "ai",
        text: "Thank you for reaching out — that takes courage. What you're describing sounds like it could be depression and anxiety, and there is help available.\n\n🧠 **Mental Health (91% confidence)** — Your description strongly matches mental health services. Here are immediate options:\n\n1. **Austin Public Health Community Counseling** — (512) 972-5759 — Affordable therapy on a sliding scale\n2. **Integral Care** — (512) 472-4357 — 24/7 crisis line and outpatient services\n3. **NAMI Central Texas** — (512) 420-9810 — Free support groups and peer support\n\nIf you're ever in a crisis, please call **988** — it's free, confidential, and available 24/7.",
        category: "Mental Health",
        confidence: 91,
        isCrisis: false,
        resources: JSON.stringify([
          { title: "988 Suicide & Crisis Lifeline", phone: "988", action: "Call 24/7 if in crisis" },
          { title: "Austin Public Health — Community Counseling", phone: "(512) 972-5759", action: "Schedule affordable therapy" },
          { title: "Integral Care — Crisis Line", phone: "(512) 472-4357", action: "24/7 crisis support" },
          { title: "NAMI Central Texas", phone: "(512) 420-9810", action: "Free support groups" },
        ]),
        why: "Your description of feeling overwhelmed, anxious, and struggling to get out of bed are classic indicators of depression and anxiety that mental health services can address.",
        also: "If you have limited income, you may also qualify for Medicaid which covers mental health treatment.",
        warning: "If you ever feel like hurting yourself, please call 988 immediately.",
      },
    ],
  });

  // Conversation 3: "I can't afford my medication"
  const conv3 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Can't afford medication",
      preview: "I can't afford my medication — need help with prescription costs",
      category: "Healthcare",
      categoryColor: "#ef4444",
      confidence: 68,
      isCrisis: false,
      isGuest: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv3.id,
        role: "user",
        text: "I can't afford my medication. I have diabetes and the insulin is so expensive. I don't have insurance right now.",
      },
      {
        conversationId: conv3.id,
        role: "ai",
        text: "I hear you — medication costs, especially insulin, are a serious concern. Here's what can help:\n\n💊 **Healthcare (68% confidence)** — While I'm somewhat confident this is primarily a healthcare issue, the resources below may also connect you with broader financial assistance:\n\n1. **Patient Assistance Programs** — 1-888-477-2669 — Many pharmaceutical companies offer free or low-cost insulin through these programs\n2. **CommUnityCare Health Centers** — (512) 978-9015 — Sliding-scale clinics that can prescribe and help you access affordable medications\n3. **Medicaid** — 1-877-541-7905 — You may qualify for health insurance that covers prescriptions\n\n⚠️ **Important**: Since my confidence is only 68%, I recommend also exploring if you qualify for SNAP food benefits, as diabetes management is closely tied to nutrition.",
        category: "Healthcare",
        confidence: 68,
        isCrisis: false,
        resources: JSON.stringify([
          { title: "Patient Assistance Programs", phone: "1-888-477-2669", action: "Apply for free/low-cost medications" },
          { title: "CommUnityCare Health Centers", phone: "(512) 978-9015", action: "Sliding-scale healthcare & pharmacy" },
          { title: "Medicaid — Texas", phone: "1-877-541-7905", action: "Apply for health coverage" },
        ]),
        why: "Medication affordability is primarily a healthcare access issue, but the moderate confidence reflects that financial assistance programs and food access also play a role.",
        also: "Look into insulin manufacturer discount programs — Eli Lilly, Sanofi, and Novo Nordisk all offer capped-price insulin programs.",
        warning: "Never skip insulin doses without consulting a doctor. If you're rationing insulin, seek emergency medical care.",
      },
    ],
  });

  // Conversation 4: "I'm a veteran and need housing"
  const conv4 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Veteran housing assistance",
      preview: "I'm a veteran and need housing — looking for veteran-specific resources",
      category: "Housing Assistance",
      categoryColor: "#f59e0b",
      confidence: 88,
      isCrisis: false,
      isGuest: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv4.id,
        role: "user",
        text: "I'm a veteran and need housing. I've been staying with friends but I need my own place. Are there programs specifically for veterans?",
      },
      {
        conversationId: conv4.id,
        role: "ai",
        text: "Thank you for your service. There are indeed several programs specifically designed to help veterans with housing:\n\n🏠 **Housing Assistance (88% confidence)** — Veteran-specific housing resources:\n\n1. **VA Homeless Programs** — Call 1-877-424-3838 — The VA offers specialized housing vouchers (VASH) and transitional housing for veterans\n2. **Foundation Communities** — (512) 610-4000 — Has affordable housing units with preference for veterans\n3. **Section 8 / HACA** — (512) 477-4488 — Veterans receive priority placement on waiting lists\n\n🎖️ **Veterans Crisis Line**: If you're in crisis, call **988 then press 1** — dedicated line for veterans.\n\nI'd recommend starting with the VA's homeless programs line — they can connect you with a case manager who specializes in veteran housing.",
        category: "Housing Assistance",
        confidence: 88,
        isCrisis: false,
        resources: JSON.stringify([
          { title: "VA Homeless Programs", phone: "1-877-424-3838", action: "Veteran housing vouchers & transitional housing" },
          { title: "Foundation Communities", phone: "(512) 610-4000", action: "Affordable housing with veteran preference" },
          { title: "Veterans Crisis Line", phone: "988 (press 1)", action: "24/7 veteran crisis support" },
        ]),
        why: "Your veteran status opens up specialized housing programs through the VA that are not available to the general public.",
        also: "You may also qualify for VA healthcare, disability benefits, and employment services through the VA.",
        warning: null,
      },
    ],
  });

  // Conversation 5: "My husband hits me" — Crisis: Domestic Violence
  const conv5 = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: "Crisis: Domestic Violence",
      preview: "I need help — domestic violence situation",
      category: "Crisis",
      categoryColor: "#dc2626",
      confidence: 99,
      isCrisis: true,
      isGuest: false,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv5.id,
        role: "user",
        text: "My husband hits me. I'm scared and I don't know what to do. I have two small children.",
      },
      {
        conversationId: conv5.id,
        role: "ai",
        text: "🚨 **Your safety is the top priority right now.**\n\nIf you are in immediate danger, please call **911**.\n\nHere are resources that can help you right now:\n\n📞 **National Domestic Violence Hotline** — 1-800-799-7233 — Available 24/7, confidential, in 200+ languages\n📞 **SAFE Alliance Austin** — (512) 267-7233 — Local shelter, legal help, and counseling\n📞 **Family Violence Prevention Services** — Legal aid specifically for domestic violence survivors\n\n**If you need to leave quickly:**\n- Pack essential documents (ID, birth certificates, medications)\n- The hotline can help you find emergency shelter\n- You do NOT need money or a plan to call — they will help you create one\n\n**Your children:** Domestic violence shelters accept children, and your kids' safety is also a priority.",
        category: "Crisis",
        confidence: 99,
        isCrisis: true,
        resources: JSON.stringify([
          { title: "National Domestic Violence Hotline", phone: "1-800-799-7233", action: "24/7 confidential support & shelter referrals" },
          { title: "SAFE Alliance Austin", phone: "(512) 267-7233", action: "Local shelter, counseling, & legal help" },
          { title: "988 Suicide & Crisis Lifeline", phone: "988", action: "Crisis support 24/7" },
        ]),
        why: "Domestic violence is a crisis situation requiring immediate safety planning and support resources.",
        also: "You may also need legal aid for protective orders and custody matters — the hotline can connect you.",
        warning: "If you feel you are in immediate physical danger, call 911. If it's not safe to make a phone call, you can text LOVEIS to 22522.",
      },
      {
        conversationId: conv5.id,
        role: "user",
        text: "I'm not in immediate danger right now but I want to leave. I don't have anywhere to go.",
      },
      {
        conversationId: conv5.id,
        role: "ai",
        text: "That's an important first step — wanting to leave and reaching out for help. Here's a plan:\n\n1. **Call the National DV Hotline** (1-800-799-7233) when it's safe to talk — they can help you create a detailed safety plan and find shelter space\n\n2. **Emergency shelter**: SAFE Alliance Austin has emergency shelter for women and children. Call **(512) 267-7233** to check availability.\n\n3. **Legal protection**: You can get a protective order through Family Violence Prevention Services — it's free and they'll help you through the process.\n\n4. **Financial help**: Once you're in a shelter, a case manager can help you apply for housing assistance, SNAP benefits, and other support.\n\n🔒 **Safety tip**: If you're looking at this on a shared device, consider clearing your browser history or using incognito mode.",
        category: "Crisis",
        confidence: 99,
        isCrisis: true,
        resources: JSON.stringify([
          { title: "National Domestic Violence Hotline", phone: "1-800-799-7233", action: "Safety planning & shelter" },
          { title: "SAFE Alliance Austin", phone: "(512) 267-7233", action: "Emergency shelter for you & children" },
          { title: "Family Violence Prevention Services — Legal Aid", phone: "(512) 267-7233", action: "Free protective order help" },
          { title: "Legal Aid Society of Central Texas", phone: "(512) 476-1188", action: "Free legal representation" },
        ]),
        why: "Continued crisis support — transitioning from immediate safety to longer-term planning.",
        also: "Caritas of Austin and Foundation Communities can help with longer-term affordable housing once you're in a safe situation.",
        warning: "Please be careful about your digital footprint — clear browser history or use incognito mode.",
      },
    ],
  });

  console.log("Created 5 demo conversations with messages");

  // ─── 5. Demo Saved Resources (3) ──────────────────────────────
  await prisma.savedResource.deleteMany({
    where: { userId: demoUser.id },
  });

  await prisma.savedResource.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Austin Emergency Rental Assistance Program",
        category: "Housing Assistance",
        categoryColor: "#f59e0b",
        confidence: 78,
        verifiedDate: "2025-12-15",
        action: "Call to apply",
        detail: "(512) 974-3100 — Mon-Fri 8am-5pm",
      },
      {
        userId: demoUser.id,
        title: "Central Texas Food Bank",
        category: "Food Assistance",
        categoryColor: "#22c55e",
        confidence: 85,
        verifiedDate: "2025-12-20",
        action: "Visit for emergency food",
        detail: "(512) 282-2111 — Mobile pantry available",
      },
      {
        userId: demoUser.id,
        title: "National Domestic Violence Hotline",
        category: "Crisis",
        categoryColor: "#dc2626",
        confidence: 99,
        verifiedDate: "2026-02-01",
        action: "Call 24/7 for support",
        detail: "1-800-799-7233 — Confidential, 200+ languages",
      },
    ],
  });

  console.log("Created 3 demo saved resources");

  console.log("\n✅ Seeding complete!");
  console.log(`   User: ${demoUser.email} (password: demo1234)`);
  console.log(`   Resources: ${resources.length}`);
  console.log(`   Conversations: 5`);
  console.log(`   Saved Resources: 3`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
