const VENDOR_PATTERNS: { name: string; patterns: string[] }[] = [
  { name: "Microsoft", patterns: ["microsoft", "windows", "azure", "entra", "office 365", "m365", "exchange", "sharepoint"] },
  { name: "Google", patterns: ["google", "gcp", "chrome", "android"] },
  { name: "Amazon AWS", patterns: ["aws", "amazon web services", "s3", "ec2"] },
  { name: "Apple", patterns: ["apple", "macos", "ios", "safari"] },
  { name: "Cisco", patterns: ["cisco", "ios xe", "anyconnect"] },
  { name: "Fortinet", patterns: ["fortinet", "fortigate", "fortios"] },
  { name: "Palo Alto", patterns: ["palo alto", "pan-os", "globalprotect"] },
  { name: "VMware", patterns: ["vmware", "esxi", "vcenter"] },
  { name: "Citrix", patterns: ["citrix", "netscaler"] },
  { name: "Oracle", patterns: ["oracle", "weblogic"] },
  { name: "Apache", patterns: ["apache", "log4j", "tomcat", "struts"] },
  { name: "Linux", patterns: ["linux", "kernel", "ubuntu", "debian", "rhel", "centos"] },
  { name: "Atlassian", patterns: ["atlassian", "confluence", "jira"] },
  { name: "SAP", patterns: ["sap"] },
  { name: "Salesforce", patterns: ["salesforce"] },
  { name: "CrowdStrike", patterns: ["crowdstrike", "falcon"] },
  { name: "Okta", patterns: ["okta"] },
  { name: "Cloudflare", patterns: ["cloudflare"] },
  { name: "Kubernetes", patterns: ["kubernetes", "k8s", "helm"] },
  { name: "Docker", patterns: ["docker", "container"] },
  { name: "Ivanti", patterns: ["ivanti", "connect secure", "pulse secure"] },
  { name: "MOVEit", patterns: ["moveit"] },
  { name: "Progress Software", patterns: ["progress software", "whatsup gold"] },
];

export function detectAffectedTechnologies(
  title: string,
  summary: string
): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const vendors: string[] = [];

  for (const vendor of VENDOR_PATTERNS) {
    if (vendor.patterns.some((p) => text.includes(p))) {
      vendors.push(vendor.name);
    }
  }

  return vendors.slice(0, 8);
}
