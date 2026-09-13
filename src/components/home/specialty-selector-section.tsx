"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { domains } from "@/lib/domains";
import { riseVariants } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { specialtySelectorStyles as styles } from "./specialty-selector-section.styles";

export function SpecialtySelectorSection({
  onSelectSpecialty: onSelectSpecialty,
  reduced,
}: {
  onSelectSpecialty: (domainId: string) => void;
  reduced: boolean;
}) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    onSelectSpecialty(domainId);
  };

  return (
    <section className={styles.root}>
      <motion.div
        variants={riseVariants(reduced)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        className={styles.header}
      >
        <h2 className={styles.title}>Chọn lĩnh vực của bạn</h2>
        <p className={styles.subtitle}>
          Lựa chọn lĩnh vực để được mentor hướng dẫn phỏng vấn chuyên sâu
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {domains.map((domain) => (
          <motion.button
            key={domain.id}
            variants={riseVariants(reduced, 12)}
            onClick={() => handleDomainSelect(domain.id)}
            className={cn(
              styles.card,
              selectedDomain === domain.id && styles.cardSelected
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={domain.comingSoon}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <domain.icon className="size-6" />
              </div>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{domain.label}</h3>
                <p className={styles.cardDescription}>{domain.description}</p>
              </div>
            </div>
            {domain.comingSoon && (
              <div className={styles.comingSoon}>Sắp ra mắt</div>
            )}
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
