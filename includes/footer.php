<?php
// =====================================================================
// includes/footer.php  -  small footer + scripts
// optional before including:  $extraJs = ['js/passenger.js'];
// =====================================================================
$extraJs = $extraJs ?? [];
?>
    <footer class="role-footer">
        <p class="role-footer-copy">&copy; 2026 CPU - Carpooling University</p>
    </footer>

    <script src="<?= $base ?>js/common.js"></script>
    <script src="<?= $base ?>js/role.js"></script>
<?php foreach ($extraJs as $js): ?>
    <script src="<?= $base . htmlspecialchars($js) ?>"></script>
<?php endforeach; ?>
</body>
</html>