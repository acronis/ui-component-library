<template>
	<div class="h-48 flex bg-ui-border justify-center items-center">
		<slot />
	</div>
</template>

<script>
export default {}
</script>

<style>
.fig-btn {
	margin-right: 0.75rem;
}

/* Dark theme overrides */

html[lights-out] {
	.fig-btn--secondary {
		filter: invert(1);
		background: transparent;
		transition: all 0.3s;
	}

	.fig-btn:disabled {
		opacity: 0.4;
	}

	.fig-checkbox {
		filter: invert(1);

		.fig-checkbox__input:checked + label:before {
			filter: invert(1);
		}

		.fig-checkbox__input:enabled:focus + label:before {
			filter: invert(1);
		}
	}

	.fig-disclosure {
		filter: invert(1);

    .fig-disclosure-item__title:focus {
			filter: invert(1);
		}
	}

  .fig-icon {
		filter: invert(1);

    .fig-icon--text {
			filter: invert(0);
		}

    .fig-tooltip__content {
			filter: invert(1);
		}
	}

  .fig-radio__field:enabled:checked:focus + label:before {
		border: 1px solid #e25d04;
		box-shadow: 0 0 0 1px #e25d04;
	}

	.fig-radio__label {
		filter: invert(1);
	}

	.fig-select__icon {
		filter: none;
	}

	.fig-label,
	.fig-text,
	.fig-title {
		filter: invert(1);
	}

	.fig-toggle__label {
		color: #fff;
	}
}
</style>
