export const INITIAL_CARDS = [
  // Foundations
  { front: "Dot product formula for vectors a, b ∈ ℝ^n", back: "$$a \\cdot b = \\sum_{i=1}^n a_i b_i = \\|a\\| \\|b\\| \\cos \\theta$$", category: "Foundations" },
  { front: "Matrix multiplication rule: (m×n)(n×p) = ?", back: "**(m×p)**. Inner dimensions must match. Complexity $O(mnp)$", category: "Foundations" },
  { front: "Eigenvalue definition", back: "For matrix A, vector $v \\neq 0$ where $Av = \\lambda v$. $\\lambda$ is eigenvalue, $v$ is eigenvector", category: "Foundations" },
  { front: "SVD of matrix A", back: "$A = U \\Sigma V^T$. $U,V$ orthogonal. $\\Sigma$ diagonal with singular values. Used for PCA, low-rank approx", category: "Foundations" },
  { front: "Bayes’ Theorem", back: "$$P(A|B) = \\frac{P(B|A) P(A)}{P(B)}$$. Posterior = Likelihood × Prior / Evidence", category: "Foundations" },
  { front: "KL Divergence", back: "$$D_{KL}(P \\parallel Q) = \\sum P(x) \\log \\frac{P(x)}{Q(x)}$$. Measures how $Q$ differs from $P$. Asymmetric. $=0$ iff $P=Q$", category: "Foundations" },
  { front: "Cross-entropy loss formula", back: "$$L = -\\sum y_i \\log \\hat{y}_i$$. For one-hot $p$, reduces to $-\\log \\hat{y}_{correct}$", category: "Foundations" },
  { front: "Softmax formula", back: "$$\\sigma(z)_i = \\frac{e^{z_i}}{\\sum e^{z_j}}$$. Turns logits into probabilities", category: "Foundations" },
  { front: "Sigmoid + derivative", back: "$$\\sigma(x) = \\frac{1}{1+e^{-x}}$$. $$\\sigma'(x) = \\sigma(x)(1-\\sigma(x))$$", category: "Foundations" },
  { front: "Chain rule for backprop, scalar case", back: "$$\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}$$", category: "Foundations" },

  // Classical ML
  { front: "Bias-Variance decomposition", back: "$$MSE = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error}$$. Underfit = high bias. Overfit = high variance", category: "Classical ML" },
  { front: "L1 vs L2 regularization effect", back: "L1 = Lasso, creates sparsity, feature selection. L2 = Ridge, shrinks weights smoothly", category: "Classical ML" },
  { front: "Precision vs Recall", back: "Precision = TP/(TP+FP). “When model says yes, is it right?” Recall = TP/(TP+FN). “Did we find all positives?”", category: "Classical ML" },
  { front: "F1 Score", back: "$$F1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$. Harmonic mean of P and R", category: "Classical ML" },
  { front: "ROC Curve axes", back: "x-axis: FPR = FP/(FP+TN). y-axis: TPR = Recall = TP/(TP+FN). AUC = area under curve", category: "Classical ML" },
  { front: "sklearn: fit vs transform vs fit_transform", back: "fit: learn params from data. transform: apply. fit_transform: do both. Don’t fit on test set", category: "Classical ML" },
  { front: "Decision tree splitting criterion for classification", back: "Gini impurity $1 - \\sum p_i^2$ or Entropy $-\\sum p_i \\log p_i$. Pick split with max info gain", category: "Classical ML" },
  { front: "SVM hinge loss", back: "$$L = \\max(0, 1 - y \\cdot f(x))$$. $y \\in \\{-1,1\\}$. Penalizes margins < 1", category: "Classical ML" },
  { front: "Kernel trick idea", back: "Replace $\\phi(x)^T \\phi(z)$ with $K(x,z)$. Compute in high-dim space without explicit $\\phi$", category: "Classical ML" },

  // Neural Networks: Core
  { front: "Universal Approximation Theorem", back: "A feedforward net with 1 hidden layer + non-linear activation can approximate any continuous function on compact subsets, given enough width", category: "Neural Networks: Core" },
  { front: "ReLU vs LeakyReLU vs GELU", back: "ReLU: max(0,x). Leaky: max(0.01x,x). GELU: $x \\cdot \\Phi(x)$, smooth, used in BERT/GPT. $\\Phi$ = CDF of N(0,1)", category: "Neural Networks: Core" },
  { front: "Why initialization matters", back: "Avoid vanishing/exploding gradients. Xavier/Glorot: $Var(w)=1/fan\\_in$ for tanh. He: $Var(w)=2/fan\\_in$ for ReLU", category: "Neural Networks: Core" },
  { front: "PyTorch: nn.Module vs nn.functional", back: "nn.Module: stateful, has parameters, goes in model. F: stateless functions like F.relu, no params", category: "Neural Networks: Core" },
  { front: "What does `loss.backward()` do", back: "Computes gradients for all tensors with requires_grad=True via autograd graph. Doesn’t update weights", category: "Neural Networks: Core" },
  { front: "What does `optimizer.step()` do", back: "Updates parameters using stored .grad values. Usually `param = param - lr * param.grad`", category: "Neural Networks: Core" },
  { front: "Why `optimizer.zero_grad()`", back: "Gradients accumulate by default in PyTorch. Must zero before backward or they sum across batches", category: "Neural Networks: Core" },
  { front: "Dropout at train vs test time", back: "Train: zero units with prob p, scale others by 1/(1-p). Test: multiply all by (1-p) or do nothing if scaling done in train. PyTorch scales in train", category: "Neural Networks: Core" },
  { front: "Batch Norm formula", back: "$$\\hat{x} = \\frac{x - \\mu}{\\sigma}$$. Then $y = \\gamma \\hat{x} + \\beta$. $\\mu, \\sigma$ per-batch in train, running avg in eval", category: "Neural Networks: Core" },
  { front: "Layer Norm vs Batch Norm", back: "BatchNorm: normalize across batch dim, per feature. LayerNorm: normalize across feature dim, per sample. LN used in Transformers, no batch dependence", category: "Neural Networks: Core" },

  // Transformers & Attention
  { front: "Scaled dot-product attention formula", back: "$$Attn(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$. Scale by sqrt($d_k$) prevents large dot products", category: "Transformers & Attention" },
  { front: "Why scale by $\\sqrt{d_k}$", back: "If Q,K have variance 1, dot product has variance $d_k$. Large values → softmax saturates → tiny gradients", category: "Transformers & Attention" },
  { front: "Multi-head attention idea", back: "Project Q,K,V to h subspaces, do attention in parallel, concat. Lets model attend to different subspaces.", category: "Transformers & Attention" },
  { front: "Transformer encoder vs decoder", back: "Encoder: self-attn + FFN, can see all tokens. Decoder: masked self-attn + cross-attn to encoder + FFN. Mask prevents looking ahead", category: "Transformers & Attention" },
  { front: "Positional encoding why needed", back: "Attention is permutation invariant. Need to inject order. Sinusoidal or learned embeddings.", category: "Transformers & Attention" },
  { front: "Causal mask in decoder", back: "Upper triangular mask of -inf before softmax so token i can’t attend to j>i. Ensures autoregressive property", category: "Transformers & Attention" },
  { front: "PyTorch: `nn.MultiheadAttention` args", back: "`embed_dim`, `num_heads`, `dropout`. Forward: `(query, key, value, attn_mask=None, key_padding_mask=None)`. Returns `attn_output, attn_weights`", category: "Transformers & Attention" },
  { front: "KV cache purpose", back: "In inference, past K,V don’t change. Cache them so each new token only computes Q for itself, attends to cached K,V. O(1) per token vs O(n)", category: "Transformers & Attention" },

  // LLMs & Training
  { front: "Next token prediction loss", back: "Cross-entropy over vocab at each position. $L = -\\log P(w_t | w_{<t})$. Teacher forcing during training", category: "LLMs & Training" },
  { front: "Perplexity definition", back: "$$PP(W) = P(w_1, ..., w_N)^{-1/N}$$ = exp(avg cross-entropy). Lower is better.", category: "LLMs & Training" },
  { front: "Temperature in sampling", back: "Divide logits by T before softmax. T→0: greedy. T=1: normal. T>1: more random. $P_i = \\frac{e^{z_i/T}}{\\sum e^{z_j/T}}$", category: "LLMs & Training" },
  { front: "Top-k vs Top-p sampling", back: "Top-k: keep k highest prob tokens, renormalize. Top-p/nucleus: keep smallest set with cumulative prob ≥ p, renormalize", category: "LLMs & Training" },
  { front: "LoRA update formula", back: "$$W = W_0 + BA$$. $W_0$ frozen. $B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}$, $r \\ll d,k$. Train only B,A. Reduces params 10000x", category: "LLMs & Training" },
  { front: "QLoRA key ideas", back: "4-bit NormalFloat quant for base model + LoRA adapters + paged optimizers. Fine-tune 65B model on 1 GPU", category: "LLMs & Training" },
  { front: "Flash Attention benefit", back: "Exact attention with O(N) memory vs O(N²) by tiling + recomputation. Uses SRAM, avoids HBM reads. 2-4x faster", category: "LLMs & Training" },
  { front: "RoPE: Rotary Positional Embedding", back: "Rotates Q,K vectors by angle $m\\theta$ where m=position. Relative position via dot product. Used in Llama", category: "LLMs & Training" },
  { front: "GQA vs MQA", back: "MHA: h heads, h K,V. MQA: h heads, 1 K,V shared. GQA: h heads, g K,V groups, g<<h. Llama 3 uses GQA. Saves KV cache memory", category: "LLMs & Training" },

  // CNNs & Vision
  { front: "Convolution output size formula", back: "$$O = \\frac{W - K + 2P}{S} + 1$$. W=input, K=kernel, P=pad, S=stride", category: "CNNs & Vision" },
  { front: "Receptive field definition", back: "Region in input that affects a given output unit. Stacking 3x3 convs increases it. 2 layers of 3x3 = 5x5 RF", category: "CNNs & Vision" },
  { front: "ResNet key innovation", back: "Residual connection: $y = f(x) + x$. Lets gradients flow, enables 100+ layer nets. Solves degradation problem", category: "CNNs & Vision" },
  { front: "1x1 convolution use case", back: "Channel-wise dimensionality reduction/expansion. No spatial mixing. Used in bottleneck blocks, Inception", category: "CNNs & Vision" },
  { front: "Transposed convolution output size", back: "$$O = (I-1)S - 2P + K + OP$$. Deconvolution, upsampling. Used in decoders, GANs.", category: "CNNs & Vision" },
  { front: "ViT patch embedding code idea", back: "```python\\nnn.Conv2d(3, dim, kernel_size=patch, stride=patch)```. Turns 224x224 image into tokens.", category: "CNNs & Vision" },

  // Optimization
  { front: "SGD update rule with momentum", back: "$$v_t = \\beta v_{t-1} + (1-\\beta)\\nabla w$$. $$w = w - \\eta v_t$$. $\\beta \\approx 0.9$. Smooths updates", category: "Optimization" },
  { front: "Adam update rules", back: "$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t$$. $$v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$$. Bias correct: $\\hat{m}_t = m_t / (1-\\beta_1^t)$", category: "Optimization" },
  { front: "Adam update rule cont.", back: "$$w = w - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$", category: "Optimization" },
  { front: "Why AdamW vs Adam", back: "AdamW decouples weight decay from gradient update. Adam: L2 reg added to grad. AdamW: decay applied directly to weights.", category: "Optimization" },
  { front: "Gradient clipping purpose + code", back: "Prevent exploding gradients in RNNs. `torch.nn.utils.clip_grad_norm_()`", category: "Optimization" },

  // Code/API
  { front: "HF: Load model + tokenizer", back: "```python\\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\\ntok = AutoTokenizer.from_pretrained('...')\\nmodel = AutoModelForCausalLM.from_pretrained('...')```", category: "Code/API Rapid Fire" },
  { front: "PyTorch: Move model to GPU", back: "```python\\ndevice = 'cuda' if torch.cuda.is_available() else 'cpu'\\nmodel.to(device)```", category: "Code/API Rapid Fire" },

  // RAG & Embeddings
  { front: "RAG pipeline steps", back: "1. Chunk docs 2. Embed chunks → vector DB 3. Embed query 4. Retrieve top-k 5. Stuff into prompt 6. LLM generates", category: "RAG & Embeddings" },
  { front: "Cosine similarity formula", back: "$$\\text{sim}(A,B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$. Range [-1,1]. Used for embedding search", category: "RAG & Embeddings" },
  { front: "HNSW in vector DBs", back: "Hierarchical Navigable Small World. Graph-based ANN index. $O(\\log N)$ search.", category: "RAG & Embeddings" }
];
