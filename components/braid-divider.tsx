export function BraidDivider({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center py-2 ${className}`} aria-hidden="true">
            <svg
                width="140"
                height="24"
                viewBox="0 0 140 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0 12 Q 17.5 2, 35 12 T 70 12 T 105 12 T 140 12"
                    stroke="var(--mwezu-gold)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                />
                <path
                    d="M0 12 Q 17.5 22, 35 12 T 70 12 T 105 12 T 140 12"
                    stroke="var(--mwezu-gold)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.55"
                />
                <circle cx="70" cy="12" r="2.5" fill="var(--mwezu-gold)" />
            </svg>
        </div>
    );
}