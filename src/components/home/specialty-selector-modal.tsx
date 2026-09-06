"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { domains } from "@/lib/domains";
import { cn } from "@/lib/utils";

interface SpecialtySelectorModalProps {
  domainId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSpecialtySelect?: (specialtyId: string) => void;
}

export function SpecialtySelectorModal({
  domainId,
  isOpen,
  onClose,
  onSpecialtySelect,
}: SpecialtySelectorModalProps) {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [isNavigating, setIsNavigating] = useState(false);

  const domain = domainId
    ? domains.find((d) => d.id === domainId)
    : null;

  if (!domain) return null;

  const handleSpecialtySelect = async (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    onSpecialtySelect?.(specialtyId);

    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    router.push(`/interview/${domainId}/${specialtyId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="w-full max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Choose Your Specialty
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a specialty in {domain.label} to begin your interview
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {domain.specialties.map((specialty, index) => {
            const Icon = specialty.icon;
            const isSelected = selectedSpecialty === specialty.id;
            const isLoading = isNavigating && isSelected;

            return (
              <motion.button
                key={specialty.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSpecialtySelect(specialty.id)}
                disabled={isNavigating}
                className={cn(
                  "relative group p-4 rounded-lg border-2 transition-all",
                  "text-left hover:shadow-lg disabled:opacity-50",
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-border hover:border-primary"
                )}
              >
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-transparent"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: domain.theme.pillBg }}
                    >
                      <Icon
                        size={20}
                        style={{ color: domain.theme.pillText }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {specialty.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Difficulty: {specialty.difficulty}/3
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {specialty.description}
                  </p>

                  {/* Button indicator */}
                  {isSelected ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        ✓
                      </motion.div>
                      {isLoading ? "Starting interview..." : "Selected"}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      Click to select →
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info */}
        <div className="flex gap-2">
          <div className="flex-1 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p>
              💡 <strong>Tip:</strong> You can change specialties anytime by
              selecting a different domain.
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isNavigating}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
